import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

let VARS = {};
let IV = [];
let RedLines=[];
let GreenLines=[];
let LinesDelete = [];
let count=0;
const parseCode = (codeToParse,inputV) => {
    VARS={};
    IV=[];
    RedLines=[];
    GreenLines=[];
    LinesDelete = [];
    inputV.split(',').forEach(function (body) {
        IV.push(body);

    } );
    let e = esprima.parseScript(codeToParse,{loc:true});
    runExtractor(e);
    let t = escodegen.generate(e)
    let r = t.split('\n');
    RedLines.forEach(function (body) {
        r[body] = '<span style="background-color:red">'+r[body]+'</span>';
    });
    GreenLines.forEach(function (body) {
        r[body] = '<span style="background-color:green">'+r[body]+'</span>';
    });
    LinesDelete.forEach(function (body){
        r.splice(body,1);
    });


    t=r.join('\n');
    t = t.replace('\n\n','\n');
    return t;
};



const getExtractor = (parsedCode) =>
{    let map = [];
    let func;
    map['Program'] = exProgram;
    map['FunctionDeclaration'] = exFunDec;
    map['BlockStatement'] = exProgram;
    //map['ForStatement'] = exFor;
    map['ExpressionStatement'] = exStat;
    //map['SequenceExpression'] = exSeq;
    map['AssignmentExpression'] = exAss;
    map['ReturnStatement'] = exRet;
    //map['WhileStatement'] = exWhile;
    map['IfStatement'] = exIf;
    map['VariableDeclarator'] = exTor;//
    map['VariableDeclaration'] = exTion;

    func = map[parsedCode];
    return func;
};
const exStat = (parsed) =>
{
    return runExtractor(parsed.expression);
}
const replaceHandler = (Bin) =>
{
    if(!(Bin.type==='Identifier'||Bin.type==='Literal'))
    {
        if ((Bin.left.type === 'Identifier' || Bin.left.type === 'Literal') && VARS[Bin.left.name])
            Bin.left = VARS[Bin.left.name];
        else
            replaceHandler(Bin.left);

        if ((Bin.right.type === 'Identifier' || Bin.right.type === 'Literal') && VARS[Bin.right.name])
            Bin.right = VARS[Bin.right.name];
        else
            replaceHandler(Bin.right);
    }
};



const runExtractor = (parsedcode) =>{
    let e =  getExtractor(parsedcode.type);
    return e(parsedcode);
};
const exProgram = (parsedcode) => {
    let VAR1 = deepcopy(VARS);
    parsedcode.body.forEach(function (body) {
        runExtractor(body);
    });
    VARS=deepcopy(VAR1);


};

const exTor = (body) => {
    LinesDelete.push(body.loc.start.line-1);
    if((body.init.type==='Identifier'||body.init.type ==='Literal') &&VARS[body.id.name])
        body.init = VARS[body.init.name];
    else
        replaceHandler(body.init);

    VARS[body.id.name] = body.init;
};
const exTion = (declaration) => {

    declaration.declarations.forEach(function (body) {
        exTor(body);

        count++;

    });


};


const exFunDec = (parsedcode) => {


    parsedcode.params.forEach(function (params) {
        VARS[params.name] = params.val;
    });


    runExtractor(parsedcode.body);


};


/*const exFor = (parsedcode) => {


    runExtractor(parsedcode.init);
    runExtractor(parsedcode.update);
    runExtractor(parsedcode.body);

};*/

/*const exSeq = (parsedcode) => {
    let Data = [];
    parsedcode.expressions.forEach(function (exp) {
        Data = Data.concat(runExtractor(exp));

    });
    return Data;
};*/

const exAss = (parsedcode) => {
    if((parsedcode.right.type==='Identifier'||parsedcode.right.type ==='Literal') &&VARS[parsedcode.right.name])
        parsedcode.right = VARS[parsedcode.right.name];
    else
        replaceHandler(parsedcode.right);

    VARS[parsedcode.left.name] = parsedcode.right;
    LinesDelete.push(parsedcode.loc.start.line-1);
    count++;

};

const exRet = (parsedcode) => {
    if((parsedcode.argument.type==='Identifier'||parsedcode.argument.type ==='Literal') &&VARS[parsedcode.argument.name])
        parsedcode.argument = VARS[parsedcode.argument.name];
    else
        replaceHandler(parsedcode.argument);
};
/*const exWhile = (parsedcode) => {

    if((parsedcode.test.type==='Identifier'||parsedcode.test.type ==='Literal') &&VARS[parsedcode.test.name])
        parsedcode.test = VARS[parsedcode.test.name];
    else
        replaceHandler(parsedcode.test);

    runExtractor(parsedcode.body);

};*/
const deepcopy = (validJSON) => {
    return JSON.parse(JSON.stringify(validJSON));
};
const exIf = (parsedcode) => {


    if((parsedcode.test.type==='Identifier'||parsedcode.test.type ==='Literal') &&VARS[parsedcode.test.name])
        parsedcode.test = VARS[parsedcode.test.name];
    else
        replaceHandler(parsedcode.test);

    let InputString = '';
    IV.forEach(function (body) {
        InputString+='let ';
        InputString+=body;
        InputString+=';';
    });
    let x = eval(InputString+escodegen.generate(parsedcode.test));
    if(x) GreenLines.push(parsedcode.test.loc.start.line-1); else { RedLines.push(parsedcode.test.loc.start.line-1);};
    runExtractor(parsedcode.consequent);
    if(parsedcode.alternate == null) {}
    else
        runExtractor(parsedcode.alternate);


};

export {parseCode};








