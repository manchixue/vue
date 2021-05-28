import { parseHTML } from "./parser";
import { generate } from "./generate";

export function compileToFunction (template) {

	let ast = parseHTML(template);

	let code = generate(ast);
	console.log(code);
}
