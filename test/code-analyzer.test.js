import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        let e = parseCode('','');
        assert.equal(
            e,
            ''
        );
    });



    it('test 2', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1,d=6;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '     c = c + x + 5;\n' +
            '     return x + y + z + c;\n' +
            '\n' +
            '    \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let c = 0;\n    return x + y + z + (0 + x + 5);'
        );
    });

    it('test 3', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1,d=6;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '     c = c + x + 5;\n' +
            '     c=a;\n'+
            '     return a;\n' +
            '\n' +
            '    \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let c = 0;\n    c = x + 1;\n}'
        );
    });
    it('test 4', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1,d=6;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    let d = c;\n' +
            '     c = c + x + 5;\n' +
            '     c=a;\n'+
            '     return a;\n' +
            '\n' +
            '    \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let c = 0;\n    c = 0 + x + 5;\n    return x + 1;'
        );
    });
    it('test 5', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +

            '    if (3 < z) {\n' +

            '        return x + y + z + 32;\n' +
            '    } else if (1 < z * 2) {\n' +

            '        return x + y + z + 12;\n' +
            '    } else {\n' +

            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n', 'x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n<span style="background-color:red">    if (3 < z) {</span>\n        return x + y + z + 32;\n<span style="background-color:green">    } else if (1 < z * 2) {</span>\n' +
            '        return x + y + z + 12;\n    } else {\n        return x + y + z + c;\n    }\n}'
        );});
    it('test 6', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    ' +
            '    let b = 8 + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let c = 0;\n        c = 0 + 5;\n        return x + y + z + (0 + 5);\n    } else {\n        return x + y + z + (0 + z + 5);\n    }\n}');});
    it('test 7', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let b = x + 1 + y;\n<span style="background-color:red">    if (x + 1 + y < z) {</span>\n        return x + y + z + (0 + 5);\n    }'
        );
    });

    it('test 8', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = z + 1;\n' +
            '    let b = 2*a + y;\n' +
            '    let c = 12;\n' +
            '    if (b < z) {\n' +
            '        c = 7*c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let b = 2 * (z + 1) + y;\n<span style="background-color:red">    if (2 * (z + 1) + y < z) {</span>\n        return x + y + z + (7 * 12 + 5);\n    }'
        );
    });
    it('test 9', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = z + 1;\n' +
            '    let b = 2*a + y;\n' +
            '    let c = 12;\n' +
            '    if (b < z) {\n' +
            '        c = 7*c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let b = 2 * (z + 1) + y;\n<span style="background-color:red">    if (2 * (z + 1) + y < z) {</span>\n        return x + y + z + (7 * 12 + 5);\n    }'
        );
    });

    it('test 10', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = 8*z + x;\n' +
            '    let c = 12;\n' +
            '    if (c < z) {\n' +
            '        c = 7*c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } \n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let c = 12;\n        c = 7 * 12 + 5;\n        return x + y + z + (7 * 12 + 5);\n}');
    });
});
