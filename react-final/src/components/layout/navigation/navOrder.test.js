import test from 'node:test';
import assert from 'node:assert/strict';
import { prioritizeNavLinks } from './navOrder.js';
test('keeps all role links and dashboard first', () => {
  for (const role of ['student', 'teacher', 'admin']) {
    const dashboard = role === 'student' ? '/dashboard' : '/' + role + '/dashboard';
    const list = [{path:'/',name:'בית'}, {path:'/messages',name:'הודעות'}, {path:dashboard,name:'דשבורד'}];
    const result = prioritizeNavLinks(list, role);
    assert.deepEqual(result.map(x => x.path), [dashboard,'/messages','/']);
    assert.equal(list[0].path, '/');
  }
});
