import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as escodegen from 'escodegen';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputVector = $('#inputV').val();
        let parsedCode = parseCode(codeToParse,inputVector);
        $('code').html(parsedCode);
    });
});
