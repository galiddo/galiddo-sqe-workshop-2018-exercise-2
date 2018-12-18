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
            'function foo(x, y, z) {\n    let a = x + 1, d = 6;\n    let b = x + 1 + y;\n    let c = 0;\n    c = 0 + x + 5;\n    return x + y + z + (0 + x + 5);\n}'
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
            'function foo(x, y, z) {\n    let a = x + 1, d = 6;\n    let b = x + 1 + y;\n    let c = 0;\n    c = 0 + x + 5;\n    c = x + 1;\n    return x + 1;\n}'
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
            'function foo(x, y, z) {\n    let a = x + 1, d = 6;\n    let b = x + 1 + y;\n    let c = 0;\n    let d = 0;\n    c = 0 + x + 5;\n    c = x + 1;\n    return x + 1;\n}'
        );
    });
    it('test 5', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let a = x + 1;\n    let b = x + 1 + y;\n    let c = 0;\n    if (x + 1 + y < z) {\n<span style="background-color:red">        c = 0 + 5;</span>\n        return x + y + z + (0 + 5);\n    } else if (x + 1 + y < z * 2) {\n' +
            '<span style="background-color:green">        c = 0 + x + 5;</span>\n        return x + y + z + (0 + x + 5);\n    } else {\n        c = 0 + z + 5;\n        return x + y + z + (0 + z + 5);\n    }\n}');
    });
    it('test 6', () => {
        let e = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n','x=1,y=2,z=3');
        assert.equal(
            e,
            'function foo(x, y, z) {\n    let a = x + 1;\n<span style="background-color:green">    let b = x + 1 + y;</span>\n    let c = 0;\n    if (x + 1 + y) {\n        c = 0 + 5;\n        return x + y + z + (0 + 5);\n    } else if (x + 1 + y < z * 2) {\n<s' +
            'pan style="background-color:green">        c = 0 + x + 5;</span>\n        return x + y + z + (0 + x + 5);\n    } else {\n        c = 0 + z + 5;\n        return x + y + z + (0 + z + 5);\n    }\n}');
    });
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
            'function foo(x, y, z) {\n    let a = x + 1;\n    let b = x + 1 + y;\n    let c = 0;\n<span style="background-color:red">    if (x + 1 + y < z) {</span>\n        c = 0 + 5;\n        return x + y + z + (0 + 5);\n    }\n}'
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
            'function foo(x, y, z) {\n    let a = z + 1;\n    let b = 2 * (z + 1) + y;\n    let c = 12;\n<span style="background-color:red">    if (2 * (z + 1) + y < z) {</span>\n        c = 7 * 12 + 5;\n        return x + y + z + (7 * 12 + 5);\n    }\n}'
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
            'function foo(x, y, z) {\n    let a = z + 1;\n    let b = 2 * (z + 1) + y;\n    let c = 12;\n<span style="background-color:red">    if (2 * (z + 1) + y < z) {</span>\n        c = 7 * 12 + 5;\n        return x + y + z + (7 * 12 + 5);\n    }\n}'
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
            'function foo(x, y, z) {\n    let a = 8 * z + x;\n    let c = 12;\n<span style="background-color:red">    if (12 < z) {</span>\n        c = 7 * 12 + 5;\n        return x + y + z + (7 * 12 + 5);\n    }\n}' );
    });
});
