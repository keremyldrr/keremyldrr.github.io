// Run with a local server on 1313 and Chrome's remote debugging port on 9333.
// Uses a separate tab and test-only browser storage, never your saved songs.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const tab = await fetch('http://127.0.0.1:9333/json/new?about:blank', {method: 'PUT'}).then(r => r.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, {once: true}));
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', ({data}) => {
  const message = JSON.parse(data);
  if (pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
const command = (method, params = {}) => new Promise(resolve => {
  const id = ++sequence;
  pending.set(id, resolve);
  socket.send(JSON.stringify({id, method, params}));
});
const evaluate = async expression => {
  const response = await command('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
  assert.equal(response.error, undefined, JSON.stringify(response.error));
  assert.equal(response.result.exceptionDetails, undefined, JSON.stringify(response.result.exceptionDetails));
  return response.result.result.value;
};

try {
  // Load the actual application with an isolated storage key.
  const html = await fetch('http://127.0.0.1:1313/song_structure/').then(r => r.text());
  await command('Page.enable');
  const loaded = new Promise(resolve => {
    const listener = ({data}) => {
      if (JSON.parse(data).method === 'Page.loadEventFired') {
        socket.removeEventListener('message', listener);
        resolve();
      }
    };
    socket.addEventListener('message', listener);
  });
  await command('Page.navigate', {url:'http://127.0.0.1:1313/song_structure/tests/'});
  await loaded;
  await command('Page.setDocumentContent', {frameId: (await command('Page.getFrameTree')).result.frameTree.frame.id,
    html: html.replace('var KEY = "songmaps";', 'var KEY = "songmaps-editor-test";')});
  await evaluate(`(${async function() {
    const check = (value, message) => { if (!value) throw Error(message); };
    const $ = id => document.getElementById(id);
    const rows = () => [...document.querySelectorAll('.sect')];
    const input = (element, value) => { element.value = value; element.dispatchEvent(new Event('input', {bubbles:true})); };
    const field = (i, name) => rows()[i].querySelector('[aria-label="' + name + '"]');
    const fills = i => rows()[i].querySelector('.sectfills input');
    const click = (i, label) => [...rows()[i].querySelectorAll('button')].find(b => b.textContent === label).click();
    const key = (key, code=key) => document.body.dispatchEvent(new KeyboardEvent('keydown', {key,code,bubbles:true}));
    $('clearBtn').click();
    key('Enter');
    check(rows().length === 2, 'Accidental section at start');
    click(0, 'Remove');
    check(rows().length === 1 && $('total').textContent === '1', 'Remove empty accidental section');
    $('clearBtn').click();
    key(' ', 'Space');
    input(field(0, 'Bars in this section'), '8');
    input(field(0, 'Section name'), 'Intro');
    input(field(0, 'Section notes'), 'quiet');
    input(fills(0), '8, 4, 4');
    check($('barNum').textContent === '8' && $('total').textContent === '8', 'Live bar editing');
    key('Enter');
    input(field(1, 'Bars in this section'), '4');
    input(field(1, 'Section name'), 'Verse');
    input(field(1, 'Section notes'), 'loud');
    input(fills(1), '2');
    click(1, 'Merge with previous');
    check(rows().length === 1 && $('total').textContent === '12', 'Merge keeps bars');
    check(fills(0).value === '4, 8, 10', 'Merge offsets and preserves fills');
    check(field(0, 'Section notes').value === 'quiet; loud', 'Merge keeps notes');
    click(0, 'Add after');
    input(field(1, 'Section name'), 'Chorus');
    click(1, 'Move up');
    check(field(0, 'Section name').value === 'Chorus', 'Move current section up');
    click(0, 'Move down');
    check(field(1, 'Section name').value === 'Chorus', 'Move section down');
    click(0, 'Add after');
    check(rows().length === 3 && $('total').textContent === '14', 'Insert missed section');
    click(1, 'Remove');
    click(1, 'Remove');
    check(rows().length === 1 && $('total').textContent === '12', 'Remove completed and live sections');
    input(field(0, 'Section name'), '<b>Intro</b>');
    check(!$('summary').querySelector('b'), 'Names rendered as plain text');
    input(field(0, 'Section name'), 'Intro');
    $('songName').value = 'Editor regression';
    input(fills(0), '0, -1');
    check(!fills(0).checkValidity(), 'Invalid fills rejected');
    input(fills(0), '4, 8, 10');
    $('saveBtn').click();
    await new Promise(resolve => setTimeout(resolve, 30));
    $('clearBtn').click();
    $('savedList').querySelector('button').click();
    check(rows().length === 1 && fills(0).value === '4, 8, 10', 'Saved edits reload');
    input(field(0, 'Bars in this section'), '16');
    input(fills(0), '16');
    $('addBtn').click();
    click(1, 'Remove');
    check($('total').textContent === '16', 'Loaded sections editable');
    window.print = () => {};
    $('printBtn').click();
    check($('sheet').textContent.includes('16') && $('sheet').textContent.includes('fill: bar 16'), 'PDF uses edited data');
    let copied;
    Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async text => {copied=text;}}});
    $('copyBtn').click();
    check(copied.includes('Intro: 16 bars') && copied.includes('fill: bar 16'), 'Text export uses edits');
    click(0, 'Remove');
    check(rows().length === 0 && $('total').textContent === '0', 'Remove last section');
    $('addBtn').click();
    check(rows().length === 1, 'Add to empty map');
  }} )()`);
  await command('Page.bringToFront');
  await command('Emulation.setDeviceMetricsOverride', {width:390, height:844, deviceScaleFactor:1, mobile:true});
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, 'Mobile has no horizontal overflow');
  await evaluate("document.querySelector('.secttools button').focus()");
  await command('Input.dispatchKeyEvent', {type:'keyDown', key:'Enter', code:'Enter', text:'\r', windowsVirtualKeyCode:13});
  await command('Input.dispatchKeyEvent', {type:'keyUp', key:'Enter', code:'Enter', windowsVirtualKeyCode:13});
  assert.equal(await evaluate("document.querySelectorAll('.sect').length"), 2, 'Enter activates editor button without counting a section');
  await evaluate(`document.querySelectorAll('.sect [aria-label="Section name"]').forEach((input, i) => {
    input.value = i ? 'Verse' : 'Intro'; input.dispatchEvent(new Event('input'));
  }); document.querySelector('.map').scrollIntoView();`);
  await writeFile('/tmp/song-mapper-editor-mobile.png', Buffer.from((await command('Page.captureScreenshot')).result.data, 'base64'));
  await command('Emulation.setDeviceMetricsOverride', {width:1280, height:1000, deviceScaleFactor:1, mobile:false});
  await evaluate('window.scrollTo(0, 0)');
  await writeFile('/tmp/song-mapper-editor-desktop.png', Buffer.from((await command('Page.captureScreenshot')).result.data, 'base64'));
  console.log('Passed: editing, insertion, removal (including empty sections), merge, reordering, fills, validation, save/load, text/PDF exports, mobile width, and keyboard controls.');
} finally {
  await command('Page.close');
  socket.close();
}
