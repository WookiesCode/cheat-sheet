// generate-editors-suite.js
// Generates the Editors suite: a hub (editors.html) plus nano, VS Code, Zed and Cursor
// sheets, and inserts its menu (#editors-nav-dropdown) next to the Home link; build-nav-groups.js
// then files it under the Editors tab with Neovim.
//
// Facts checked 2026-11-07 against official sources: GNU nano 9.2; VS Code 1.145 (Nov 4, 2026)
// default Linux keys and `code` CLI; Zed 1.27.0 (Nov 4, 2026) default-linux.json keymap and
// `zed` CLI; Cursor's shortcut reference (it lists macOS keys only; on Linux and Windows Ctrl
// takes the place of Cmd, as in VS Code, which Cursor is built on) and the `agent` CLI.
// Menu logos: official marks (Simple Icons 15.0.0, CC0; Devicon 2.18.0, MIT). nano uses the GNU
// project mark: GNU nano's own logo only exists as a 128 KB drawing, and Simple Icons' "Nano" is a coin.
//
// Re-runnable: sheet .js files are rewritten every run; .html files are only created when
// missing (existing pages own their chrome); the menu is replaced if present.
const fs = require('fs');
const path = require('path');

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LOGOS = {
 "nano": "<svg class=\"menu-logo logo-chip\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#A42E2B\" d=\"M5.072 13.931a.62.62 0 00-.52.338c-.114.211-.388.242-.516.201-.21-.07-.48-.119-.744.068-.263.187-.546.045-.495-.297.05-.34.172-.645.5-.83.713-.41.216-.695.607-1.108.394-.412.307-.537.293-1.1-1.326-.2-2.077-.58-2.915-1.63C.442 8.528.117 7.664.03 6.35-.057 5.033.02 4.18.588 3.09 1.156 2 1.756 1.475 2.788.93 3.825.383 4.84.254 5.78.271c.938.014 1.563.082 2.093.386.53.303 1.016.684 1.324.685.24.015.477-.053.673-.192.04 1.02-.878 1.108-1.698 1.13-.82.02-1.324-.317-2.08-.192-.754.128-1.992.47-2.595 1.52-.603 1.05-.624 1.42-.573 2.3.05.879.806 1.535 1.234 1.543.428.007.523-.117.898-.36.374-.246 2.284-2.61 2.934-3.14.653-.53 1.296-.696 1.99-.705.695-.008.87.015 1.433.246.56.229.903.652 1.355.91.23-.135.375-.34.584-.495.76-.552 1.152-.702 2.053-.615.518.052 1.17.347 1.56.686.693.604 1.265 1.44 1.727 2.079.36.497.785 1.09 1.392 1.277.66.2 1.157-.652 1.23-1.13.043-.27.097-.505.097-.8 0-.297-.03-.655-.115-.965a3.453 3.453 0 00-.392-.87c-.258-.415-.68-.85-1.116-1.071-.246-.125-.826-.353-1.19-.36-.449-.01-.79.14-1.202.168-.5.034-1.396.146-1.786-.24-.25-.246-.283-.41-.324-.73a.76.76 0 00.4.162c.314.026.606-.23.86-.378.21-.123.504-.34.778-.45.704-.285 1.567-.278 2.31-.2.594.06 1.367.324 1.89.62.525.297 1.03.798 1.4 1.269.465.594.72 1.104.888 1.844.216.945.277 2.365.015 3.299-.205.734-.887 1.86-1.467 2.414-.573.547-1.235.81-1.986.955.03.149.033.29.071.416.056.178.163.375.38.313.086-.025.133-.047.246.053.115.1.056.484-.266.66-.164.085-.334.103-.595.11a5.61 5.61 0 01-.953-.046c-.283-.047-.45-.272-.765-.308-.484-.055-.854-.404-1.244-.653-.162-.104-.218-.104-.31-.158.05.154.117.314.15.465.034.145.02.284.037.403.02.12.052.21.07.308.077.068.103.173.233.207.13.035.334-.018.468-.037.135-.018.224-.09.327-.07.105.02.204.096.292.166s.164.08.234.254c.07.178.135.537.146.777.01.24-.018.455-.089.648-.07.19-.135.273-.327.463s-.505.465-.818.66c.058.084.083.162.173.254.09.094.277.197.36.295.083.098.126.168.126.277a.587.587 0 01-.092.373c-.223.3-.483.352-.803.492.054.334.098.572.02.906-.03.137-.102.445-.27.525-.17.08-.492.041-.698.074-.205.031-.32.063-.48.094-.097.141-.24.297-.29.422-.05.127-.034.172.006.3.042.128.185.315.225.468a.93.93 0 01.01.463.834.834 0 01-.23.396c-.128.135-.38.24-.508.346-.125.11-.252.123-.217.303.047.248.41.646.67.744a.793.793 0 00.557-.04c-.014.208-.195.353-.315.493.322-.094.636-.27.854-.504-.067.203-.3.529-.645.816-.345.287-.343.229-.517.344.314.06.606.045.85.002a1.69 1.69 0 01-.64.207 1.876 1.876 0 01-.73-.055c-.26-.063-.499-.301-.814-.465.03.119.053.26.185.38.136.12.335.183.55.284-.273-.03-.559-.037-.825-.096a2.083 2.083 0 01-.478-.164c-.144-.07-.255-.176-.384-.264.06.117.08.256.184.352.104.098.275.135.412.199-.143-.004-.28.029-.43-.01a1.166 1.166 0 01-.443-.21 3.165 3.165 0 01-.445-.395c-.132-.145-.296-.332-.345-.463-.048-.133.03-.225.044-.338-.09.06-.2.094-.272.18-.07.088-.131.166-.1.318.03.15.171.338.27.506-.295-.242-.46-.336-.53-.625-.064-.273.104-.52.233-.725.064-.104.161-.2.22-.3-.134-.128-.284-.24-.4-.388-.112-.15-.161-.352-.276-.492-.117-.143-.274-.232-.41-.348.119.256.317.572.359.77.044.2-.048.323-.12.43-.07.108-.183.134-.291.198-.11.068-.277.016-.342.113s-.083.246-.021.344l.256.398a1.173 1.173 0 01-.327-.28c-.074-.097-.186-.189-.2-.317-.015-.13-.022-.246.064-.363.084-.117.318-.156.422-.246.105-.09.162-.148.156-.264-.006-.117-.12-.2-.217-.273-.3-.225-.68-.43-.934-.699a.931.931 0 01-.24-.379c-.03-.105.002-.188.072-.314.072-.13.315-.305.346-.443.029-.14-.095-.172-.205-.22-.111-.05-.322.024-.425-.062-.103-.086.03-.266-.086-.365-.116-.099-.38-.045-.52-.15a.724.724 0 01-.24-.395.828.828 0 01-.02-.436c.032-.113.128-.133.187-.19.06-.058.108-.105.03-.192-.074-.088-.33.004-.476-.105-.15-.113-.06-.38-.163-.494-.104-.109-.287-.066-.386-.104-.097-.035-.135.09-.194-.109-.06-.199-.063-.797-.143-1.02-.08-.223-.238-.016-.31-.236-.076-.22-.005-.574-.038-.908l-.15-.91c-.52.352-.867.463-1.428.561-.047 1.373-.176 2.182.29 3.705.466 1.521 1.409 2.42 2.68 3.707-1.68-1.256-2.478-2.279-2.98-3.588-.501-1.31-.406-2.407-.356-3.666zm8.918-.553a.837.837 0 01.376.098c.09.061.188.107.27.19.206.21.36.462.428.751.044.186.05.422.064.64-.062-.2-.103-.409-.192-.589-.14-.285-.376-.56-.672-.688a.35.35 0 00-.214-.027c.023.041.063.076.065.133 0 .06-.012.174-.112.223-.16.078-.34.021-.464-.086a.414.414 0 01-.102-.459c.08-.194.375-.194.553-.186zm-1.62-.272c.016-.332.134-.609.432-.77.187-.107.392-.18.604-.215.207-.026.713-.008 1.018.13.232.105.39.271.597.394.205.121.35.201.546.338.3.211.475.44.682.576.1.066.24.057.374.098-.104.03-.24.064-.35.03a1.565 1.565 0 01-.438-.265 2.946 2.946 0 00-.497-.359c-.124-.072-.33-.158-.466-.246-.135-.09-.37-.283-.502-.349a1.618 1.618 0 00-.65-.125c-.256.008-.626.05-.822.228-.197.18-.27.336-.227.566.073-.084.123-.19.195-.254.154-.133.33-.139.52-.113.216.027.323.15.394.354-.047-.033-.135-.109-.204-.135a.495.495 0 00-.438.043c-.18.098-.13.24-.154.396-.013.076-.04.133-.06.2a.39.39 0 01-.18-.099c0 .076-.01.141.005.223.014.084.055.184.084.273-.126-.125-.256-.24-.335-.402a1.058 1.058 0 01-.13-.517zm.218-2.4c.09-.134.12-.343.174-.515-.02.217.02.453-.083.609-.105.158-.292.129-.443.176.118-.09.258-.131.352-.268zm-2.206 3.203c.119-.096.438-.02.676-.002l-.514.133c-.017.06-.01.123-.048.174-.04.051-.114.068-.171.104.006-.155-.062-.313.057-.409zm1.682-6.65c.143.075.32.178.45.18.123.004.157-.08.231-.131.115.38.25.797.448 1.142.083.146.136.079.2.224.063.145.09.439.15.626s.137.32.207.483c-.174-.25-.4-.566-.5-.773-.098-.207-.035-.225-.115-.421-.078-.198-.238-.504-.357-.756-.086.01-.19.026-.255.006-.065-.021-.054-.091-.112-.134-.06-.045-.158-.027-.24-.1-.08-.07-.1-.217-.107-.346zm-.766 1.875c.135-.012.299.023.425.017.126-.006.216-.04.324-.06-.02-.19-.002-.537-.175-.664-.115-.08-.578-.02-.701.006-.28.06-.604.227-.873.33.258-.18.48-.346.79-.44.189-.054.622-.128.814-.075.089.023.104.06.158.135.183.255.183.475.23.773.046.07.095.119.134.194a.91.91 0 01.068.289c-.048-.07-.018-.155-.15-.206-.134-.053-.335-.005-.515.014.13.096.195.186.2.384.007.233-.19.4-.397.417-.285.022-.434-.041-.55-.285-.05-.107-.015-.236-.017-.341-.346.024-.34.013-.592.222.139.2.224.315.45.436.126.066.27.133.426.16.157.027.415.053.58.027a.629.629 0 00.38-.187c.122-.112.134-.274.181-.403a1.2 1.2 0 01-.07.37c-.14.27-.38.353-.667.353-.275 0-.616-.063-.873-.17-.205-.084-.545-.324-.625-.533-.056-.143-.012-.318-.018-.477.285-.19.354-.143.689-.198.14-.025.239-.076.374-.088zm-1.655-1.28c.007-.113.02-.11.03-.166-.26-.07-.36.099-.514.41-.057.116 0 .187-.062.264-.06.076-.16.065-.257.139-.098.074-.196.215-.29.292-.188.156-.446.25-.666.358.15-.111.443-.28.538-.44.05-.085.042-.246.12-.324.078-.075.105-.13.205-.15.1-.018.06-.135.093-.228.032-.091.097-.158.165-.251s.156-.23.29-.282c.136-.05.348.005.45-.023.103-.03.044-.105.119-.15s.219-.023.32-.072c.176-.084.26-.227.367-.377.015.326.01.56-.107.869-.131.346-.266.55-.641.763-.128.072-.257.098-.365.137.062-.086.152-.123.188-.256.034-.136.009-.4.017-.512zM15.7 9.447c-.177.014-.22-.012-.363.09l.232.36c-.006-.236.018-.284.133-.45zm-.465-.172c.246-.104.46-.19.73-.207.107-.008.274.009.383.016.094-.137.21-.244.256-.4.028-.104.015-.584-.038-.71-.146-.36-.29-.376-.495-.584-.146-.15-.152-.38-.197-.638-.015-.094-.062-.213-.084-.31a3.9 3.9 0 00-.857-.045c.148-.143.29-.271.334-.486a.959.959 0 00-.113-.667c-.12-.191-.315-.36-.494-.517-.178-.155-.436-.284-.604-.412.22-.077.444-.194.66-.235.56-.108 1.043.057 1.584.384.315.19.573.37.902.716.33.344.735.975 1.053 1.348.317.375.575.67.853.893.276.226.528.289.792.43l.412.439.335-.413.535.06.111-.601.49-.136-.079-.811.354-.252-.267-.504.27-.553-.352-.63.135-.607-.407-.348-.053-.646-.569-.217-.227-.56-.64-.008-.315-.417-.43.03-.48-.053-.27-.2-.395.26-.477-.247-.947.36.618-.538.64-.102.49-.126.662.218.582-.147.563.33.596-.03.293.525.591.067.32.58.372.206.1.746.333.315-.148.653.39.494-.363.529.39.332-.499.443.506.529-.613.2.398.566-.5.088.327.622-.563-.008.285.466-.62-.074.147.672-.468-.411-.159.814-.322-.585-.175.73-.397-.537.011.765-.439-.688c.091.39.073.817.33 1.185.793-.107 1.311-.307 1.92-.892.552-.533 1.214-1.644 1.394-2.35.204-.802.21-2.281.01-3.101-.195-.787-.447-1.163-.897-1.807-.43-.455-.853-.94-1.399-1.264-.8-.48-1.828-.608-2.74-.596a3.22 3.22 0 00-1.147.215c-.527.19-.95.61-1.487.818-.175.067-.315.068-.454-.004.135.27.28.39.62.49.243.07.824.025 1.226-.012.43-.04.654-.167 1.238-.16.57.01 1.024.225 1.272.368.511.292.877.614 1.196 1.13.175.28.298.6.383.924.086.324.124.688.13 1.006.006.318-.019.602-.097.888-.182.669-.583 1.35-1.407 1.245-.504-.063-1.263-1.01-1.518-1.357-.514-.701-1.042-1.477-1.687-2.06a2.587 2.587 0 00-1.463-.65c-.992-.09-1.287.099-2.033.716.15.047.3.074.455.145.346.156.662.357.938.615.29.27.42.442.43.829.007.259-.204.465-.4.649-.117.114-.274.218-.37.307-.128.117-.286.246-.125.432.06.07.165.123.252.189.14.103.075.488-.108.592a.61.61 0 01-.713-.061c.246-.035.402-.068.395-.27-.002-.115-.15-.213-.297-.28-.35-.16-.614-.134-.963-.386-.353-.254-.36-.393-.455-.79-.17.017-.327.02-.554.097-.226.074-.478.254-.684.299-.52.11-.623.078-.907.006-.501-.132-1.15.09-1.8.299-.107.033-.543 0-.836.102a5.518 5.518 0 00-1.457.853c-.556.469-1.286 1.869-1.698 3.477-.045.49.095.817-.213 1.055-.308.24-.3.851-.405 1.023-.103.17-.225.094-.45.336-.223.24-.337.201-.332.654.195-.125.477-.273.725-.285.22-.006.222.283.785-.273.3-.299.88-.309 1.283-.439.402-.13 1.125-.402 1.85-1.21.725-.81 1.072-1.664 1.213-2.896.02.215.06.463-.033 1.065-.095.604-.296 1.28.13 2.092l.264.504c-.157-.215-.465-.566-.56-.815l-.21-.577c-.48.752-.59.885-1.256 1.423-.026.334-.033.682.076 1.002.108.32-.064.688.02.9.082.21.273.09.336.303s-.032.635.064.842c.1.207.337.082.453.15.115.066.154.158.215.246.063.088-.023.297.103.365.126.066.32.01.453.074.13.066.15.223.12.361-.033.141-.173.205-.234.348a.365.365 0 00.02.373c.074.131.236.201.4.27.162.064.39.027.559.12.169.09.32.272.408.405a.542.542 0 01.109.363 1.038 1.038 0 01-.137.434c-.074.135-.236.3.02.555.254.254.246.145.393.313-.017-.289-.135-.52-.05-.738.089-.217.35-.256.485-.352.139-.1.219-.232.326-.348 0 .148.015.31-.002.42-.033.227-.102.432.237.467.153.016.299-.082.458-.14-.084.147-.23.27-.252.45a.793.793 0 00.13.56c.123.18.34.312.498.415.158.105.244.115.365.174.006.176-.03.363-.01.53a.962.962 0 00.17.454c.098.14.252.22.398.32-.08-.188-.242-.365-.24-.56.002-.197.06-.335.252-.51.19-.175.64-.325.85-.495a1.03 1.03 0 00.355-.436c.075-.164.055-.43.07-.576.068.205.078.27.102.486.02.217-.127.521-.19.68a1.02 1.02 0 00.51-.525c.058.035.03.125.05.301.094-.092.2-.162.293-.25.094-.088.195-.164.243-.287.046-.12.027-.252-.007-.393-.035-.143-.193-.307-.28-.463-.083-.152.017-.305.01-.492-.17-.029-.313-.117-.51-.088-.196.03-.42.248-.622.252-.2 0-.314-.188-.478-.238-.165-.053-.33-.045-.495-.07.21-.199 1.02-.295 1.576-.385a9.794 9.794 0 011.47-.133c.22-.006.506.068.66.025.153-.045.12-.15.165-.264.13-.318.066-.604-.004-.924-.444-.053-.908-.115-1.356-.082-.438.033-.956.242-1.41.256-.39.014-.975-.074-1.31-.28-.414-.25-.732-.79-.846-.966-.184-.28-.415-.836-.56-1.088-.14-.254-.171-.324-.29-.43-.116-.105-.276-.113-.417-.17.16.014.336-.035.482.047.22.127.465.648.601.877.145-.486.11-.676.53-.95-.337.378-.347.665-.429 1.11.28.46.67 1.193 1.18 1.396.186.074.502.12.7.145.622.076 1.22-.119 1.83-.27.444-.11.896-.066 1.437-.035.183.012.616-.1.707-.283a.33.33 0 00-.024-.33c-.07-.105-.255-.158-.355-.254-.1-.098-.156-.21-.235-.314a6.51 6.51 0 01-1.062.115c.22-.09.433-.14.66-.23.237-.098.463-.219.676-.359.186-.123.303-.193.438-.334.133-.143.304-.289.403-.463.1-.174.114-.369.12-.584.004-.215-.005-.516-.088-.69-.084-.173-.243-.226-.37-.265-.128-.04-.217.063-.35.076-.134.014-.258.096-.452.006a1.68 1.68 0 01-.617-.548c-.196-.274-.335-.722-.534-1.067-.343-.596-.77-1.15-1.18-1.702a3.392 3.392 0 01-.1-.508c-.032-.322-.036-.656.064-.97.075-.24.188-.493.438-.591a.48.48 0 01.317-.022c.09.032.18.135.142.252-.04.129-.127.134-.188.198a.693.693 0 00-.183.33c.11-.004.262-.011.354.013.12.03.23.11.29.279-.142-.126-.212-.185-.39-.188-.082-.002-.18.026-.27.04-.034.109-.054.244-.1.33-.05.084-.142.063-.177.16a.992.992 0 00-.02.392h.004zm1.242-.15c.056.022.075.028.146.08.07.053.165.105.22.23a.878.878 0 01.04.4c-.048-.015-.113-.005-.163-.047-.05-.043-.08-.14-.143-.18-.065-.043-.117-.034-.188-.043.038.096.05.199.036.3-.036.204-.156.308-.352.33-.084.013-.22-.015-.292-.028.034.075.09.143.126.219.164-.023.285-.02.375-.061.088-.041.183-.135.296-.173.113-.04.214-.04.338-.06-.098.085-.162.168-.26.254l.215.623c.152.096.294.146.485.263.19.116.42.327.67.44.248.112.395.176.656.224.26.05.467.262.722.295.255.032.735.041.932.021.225-.02.516-.135.542-.38-.188.044-.475.004-.619-.35-.064-.156-.034-.446-.132-.63-.099-.187-.236-.246-.4-.475-.164-.23-.43-.59-.58-.895-.15-.308-.188-.654-.313-.93-.128-.273-.319-.494-.469-.707-.323-.463-.584-.777-1.12-1.011-.257-.112-.55-.143-.823-.213-.113.05-.268.104-.295.237a.536.536 0 00.12.42c.16.166.395.343.487.604.06.168.076.73.025.883-.054.16-.178.257-.282.36zm.052 1.332c-.05.043-.087.087-.167.122-.08.036-.19.045-.295.07.148.232.305.467.447.71.143.242.266.51.4.764-.006-.147.003-.301-.018-.437-.02-.136-.083-.254-.145-.461-.06-.206-.135-.484-.222-.768zm-4-5.087a3.32 3.32 0 00.065.806c.058.267.11.404.328.564.396.295.648.245.955.416.145.08.328.217.382.359.053.146-.036.3-.146.363.192.029.408-.19.318-.41-.045-.11-.255-.16-.32-.271a.41.41 0 01-.033-.335c.053-.202.454-.388.597-.546.218-.248.3-.453.177-.77-.172-.445-.842-.804-1.242-.98-.183-.08-.287-.083-.43-.128.293.174.602.31.75.69.124.32.016.444.022.72.002.13.172.197.248.277.064.072.06.125.008.223a.256.256 0 00-.11-.2c-.113-.08-.235-.062-.295-.224-.09-.248.09-.484-.112-.762-.15-.208-.353-.441-.625-.447a1.073 1.073 0 00-.36.058l-.183-.22-.005-.003c-.372-.34-.626-.62-1.146-.852-.522-.234-.78-.27-1.38-.256-.596.013-1.19.063-1.882.66-.694.6-2.48 2.888-2.915 3.177-.43.289-.527.389-1.068.389-.54 0-1.387-.766-1.42-1.723-.032-.956-.045-1.297.62-2.45.665-1.151 1.867-1.504 2.762-1.624.895-.12 1.432.194 2.092.195.66.002 1.314-.11 1.508-.637-.095.056-.221.12-.577.1-.355-.018-.85-.43-1.402-.705C7.157.548 6.54.515 5.75.501c-.79-.015-1.777.045-2.755.574C2.018 1.6 1.35 2.16.783 3.195.215 4.228.13 5.07.223 6.322.313 7.57.7 8.5 1.442 9.42c.744.914 1.485 1.363 2.823 1.529l.283-1.242-.504.72.014-.802-.455.565-.202-.767-.367.615-.183-.855-.535.432.17-.705-.707.078.324-.491-.644.006.375-.653-.57-.091.454-.596-.698-.206.578-.555-.573-.467.448-.348-.42-.56.448-.52-.167-.684.379-.33.113-.785.426-.214.365-.61.677-.073.334-.553.68.035.642-.348.666.154.756-.228.562.13.73.108.706.564-1.08-.377-.545.26-.45-.273-.31.21-.55.056-.492-.03-.358.436-.732.007-.26.59-.65.227-.06.678-.468.366.155.637-.401.664.31.58-.305.53.403.264-.09.853.563.14.125.634.613-.063.38.434.47-.461c.859-.428 1.213-.668 1.883-1.391.76-.823 1.196-1.584 2.208-2.147.73-.405 1.32-.551 2.139-.408.766.132 1.024.593 1.59 1.077.06-.11.07-.14.168-.218-.03.142-.08.287-.093.423z\"/></svg>",
 "vscode": "<svg class=\"menu-logo\" viewBox=\"0 0 128 128\" width=\"14\" height=\"14\" aria-hidden=\"true\"><mask id=\"scr-vscode-a\" width=\"128\" height=\"128\" x=\"0\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\"><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M90.767 127.126a7.968 7.968 0 0 0 6.35-.244l26.353-12.681a8 8 0 0 0 4.53-7.209V21.009a8 8 0 0 0-4.53-7.21L97.117 1.12a7.97 7.97 0 0 0-9.093 1.548l-50.45 46.026L15.6 32.013a5.328 5.328 0 0 0-6.807.302l-7.048 6.411a5.335 5.335 0 0 0-.006 7.888L20.796 64 1.74 81.387a5.336 5.336 0 0 0 .006 7.887l7.048 6.411a5.327 5.327 0 0 0 6.807.303l21.974-16.68 50.45 46.025a7.96 7.96 0 0 0 2.743 1.793Zm5.252-92.183L57.74 64l38.28 29.058V34.943Z\" clip-rule=\"evenodd\"/></mask><g mask=\"url(#scr-vscode-a)\"><path fill=\"#0065A9\" d=\"M123.471 13.82 97.097 1.12A7.973 7.973 0 0 0 88 2.668L1.662 81.387a5.333 5.333 0 0 0 .006 7.887l7.052 6.411a5.333 5.333 0 0 0 6.811.303l103.971-78.875c3.488-2.646 8.498-.158 8.498 4.22v-.306a8.001 8.001 0 0 0-4.529-7.208Z\"/><g filter=\"url(#scr-vscode-b)\"><path fill=\"#007ACC\" d=\"m123.471 114.181-26.374 12.698A7.973 7.973 0 0 1 88 125.333L1.662 46.613a5.333 5.333 0 0 1 .006-7.887l7.052-6.411a5.333 5.333 0 0 1 6.811-.303l103.971 78.874c3.488 2.647 8.498.159 8.498-4.219v.306a8.001 8.001 0 0 1-4.529 7.208Z\"/></g><g filter=\"url(#scr-vscode-c)\"><path fill=\"#1F9CF0\" d=\"M97.098 126.882A7.977 7.977 0 0 1 88 125.333c2.952 2.952 8 .861 8-3.314V5.98c0-4.175-5.048-6.266-8-3.313a7.977 7.977 0 0 1 9.098-1.549L123.467 13.8A8 8 0 0 1 128 21.01v85.982a8 8 0 0 1-4.533 7.21l-26.369 12.681Z\"/></g><path fill=\"url(#scr-vscode-d)\" fill-rule=\"evenodd\" d=\"M90.69 127.126a7.968 7.968 0 0 0 6.349-.244l26.353-12.681a8 8 0 0 0 4.53-7.21V21.009a8 8 0 0 0-4.53-7.21L97.039 1.12a7.97 7.97 0 0 0-9.093 1.548l-50.45 46.026-21.974-16.68a5.328 5.328 0 0 0-6.807.302l-7.048 6.411a5.336 5.336 0 0 0-.006 7.888L20.718 64 1.662 81.386a5.335 5.335 0 0 0 .006 7.888l7.048 6.411a5.328 5.328 0 0 0 6.807.303l21.975-16.681 50.45 46.026a7.959 7.959 0 0 0 2.742 1.793Zm5.252-92.184L57.662 64l38.28 29.057V34.943Z\" clip-rule=\"evenodd\" opacity=\"0.25\" style=\"mix-blend-mode:overlay\"/></g><defs><filter id=\"scr-vscode-b\" width=\"144.744\" height=\"113.408\" x=\"-8.41115\" y=\"22.5944\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset/><feGaussianBlur stdDeviation=\"4.16667\"/><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"/><feBlend in2=\"BackgroundImageFix\" mode=\"overlay\" result=\"effect1_dropShadow_1_36\"/><feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow_1_36\" result=\"shape\"/></filter><filter id=\"scr-vscode-c\" width=\"56.6667\" height=\"144.007\" x=\"79.6667\" y=\"-8.0035\" color-interpolation-filters=\"sRGB\" filterUnits=\"userSpaceOnUse\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"/><feColorMatrix in=\"SourceAlpha\" result=\"hardAlpha\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0\"/><feOffset/><feGaussianBlur stdDeviation=\"4.16667\"/><feColorMatrix values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0\"/><feBlend in2=\"BackgroundImageFix\" mode=\"overlay\" result=\"effect1_dropShadow_1_36\"/><feBlend in=\"SourceGraphic\" in2=\"effect1_dropShadow_1_36\" result=\"shape\"/></filter><linearGradient id=\"scr-vscode-d\" x1=\"63.9222\" x2=\"63.9222\" y1=\"0.329902\" y2=\"127.67\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient></defs></svg>",
 "zed": "<svg class=\"menu-logo logo-chip\" viewBox=\"0 0 128 128\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#084CCF\" d=\"M12 8a4 4 0 0 0-4 4v88H0V12C0 5.373 5.373 0 12 0h107.172c5.345 0 8.022 6.463 4.242 10.243L57.407 76.25H76V68h8v10.25a6 6 0 0 1-6 6H49.407L35.657 98H98V48h8v50a8 8 0 0 1-8 8H27.657l-14 14H116a4 4 0 0 0 4-4V28h8v88c0 6.627-5.373 12-12 12H8.828c-5.345 0-8.022-6.463-4.242-10.243L70.343 52H52v8h-8V50a6 6 0 0 1 6-6h28.343l14-14H30v50h-8V30a8 8 0 0 1 8-8h70.343l14-14Z\"/></svg>",
 "cursor": "<svg class=\"menu-logo logo-chip\" viewBox=\"0 0 128 128\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"url(#scr-cursor-a)\" d=\"m64 128 55.6-32L64 64 8.4 96Z\"/><path fill=\"url(#scr-cursor-b)\" d=\"M119.6 96V32L64 0v64Z\"/><path fill=\"url(#scr-cursor-c)\" d=\"M64 0 8.4 32v64L64 64Z\"/><path fill=\"#555\" d=\"M119.6 32 64 128V64Z\"/><path d=\"M119.6 32 64 64 8.4 32Z\"/><defs><linearGradient id=\"scr-cursor-a\" x1=\"11.925\" x2=\"11.925\" y1=\"12\" y2=\"24\" gradientTransform=\"translate(.4) scale(5.33333)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".16\" stop-opacity=\".39\"/><stop offset=\".658\" stop-opacity=\".8\"/></linearGradient><linearGradient id=\"scr-cursor-b\" x1=\"22.35\" x2=\"11.925\" y1=\"6.037\" y2=\"12.15\" gradientTransform=\"translate(.4) scale(5.33333)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".182\" stop-opacity=\".31\"/><stop offset=\".715\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"scr-cursor-c\" x1=\"11.925\" x2=\"1.5\" y1=\"0\" y2=\"18\" gradientTransform=\"translate(.4) scale(5.33333)\" gradientUnits=\"userSpaceOnUse\"><stop stop-opacity=\".6\"/><stop offset=\".667\" stop-opacity=\".22\"/></linearGradient></defs></svg>"
};

// 1. Section data. Each section becomes one sheet. `group` picks the nav column.
const EDITOR_SECTIONS = [
  {
    id: "nano", group: "terminal", file: "nano", badge: "nano", code: "nano",
    name: "GNU nano", navDesc: "edit configs on a server",
    title: "GNU nano: Edit Config Files on a Server",
    subtitle: "The editor that is on every server: open at a line, save, search and replace, cut and paste lines, and a nanorc that makes it pleasant",
    commands: [
      {
        id: "nano-open-line",
        desc: "Open a file at a given line (with line numbers on)",
        cmd: "nano -l +120 /etc/ssh/sshd_config",
        flags: [
          ["+120", "Start at line 120; +120,8 also sets the column. +/PermitRoot starts at the first match"],
          ["-l / --linenumbers", "Show line numbers, handy when an error message names a line"],
          ["-v / --view", "Read-only: you cannot change the file by accident"],
          ["-B / --backup", "Keep the previous version as file~ when you save"],
          ["-m / --mouse", "Click to place the cursor and scroll with the wheel"],
          ["-E -T 4", "Convert typed tabs to spaces, tab width 4 (YAML wants spaces)"]
        ],
        subcommands: [
          ["nano -v /var/log/syslog", "Page through a log without any risk of editing it"],
          ["nano +/ListenAddress /etc/ssh/sshd_config", "Open at the first match of a word"]
        ],
        tip: "Use -v when you only need to read",
        tags: ["open", "line", "view", "flags"]
      },
      {
        id: "nano-sudoedit",
        desc: "Edit a root-owned file safely with sudoedit",
        cmd: "sudoedit /etc/fstab",
        flags: [
          ["sudoedit (= sudo -e)", "Copies the file to a temp file, runs your editor as you, and writes it back as root only when you save"],
          ["Why not sudo nano", "Your editor, its config and plugins never run as root, and a crash cannot leave the real file half-written"],
          ["SUDO_EDITOR=nano", "Pick the editor sudoedit uses (it also honours VISUAL and EDITOR)"]
        ],
        subcommands: [
          ["sudo cp -a /etc/fstab /etc/fstab.bak.$(date +%F)", "Keep a dated copy before you touch it (changes state)"],
          ["sudo findmnt --verify", "Check /etc/fstab before the next reboot finds the mistake"],
          ["sudo sshd -t", "Check sshd_config before restarting sshd"],
          ["sudo visudo -c", "Check sudoers syntax"]
        ],
        tip: "Back up, sudoedit, then validate",
        tags: ["sudoedit", "sudo", "root", "safe", "fstab", "validate"]
      },
      {
        id: "nano-save-exit",
        desc: "Save, exit and get help (the bottom two lines list the rest)",
        cmd: "Ctrl+O  Enter  ·  Ctrl+X",
        flags: [
          ["Ctrl+O", "Write Out: save; Enter confirms the file name (change it to save a copy)"],
          ["Ctrl+X", "Exit; if there are changes it asks Y (save), N (discard) or Ctrl+C (cancel)"],
          ["Ctrl+S", "Save without the file-name prompt"],
          ["Ctrl+G", "Help: every key binding for your version"],
          ["^ and M-", "In nano's own help ^ means Ctrl and M- means Alt (Meta): M-U is Alt+U"]
        ],
        tip: "^ = Ctrl, M- = Alt",
        tags: ["save", "exit", "write out", "help", "keys"]
      },
      {
        id: "nano-search-replace",
        desc: "Search and replace",
        cmd: "Ctrl+W  ·  Ctrl+\\",
        flags: [
          ["Ctrl+W", "Where Is: search forward; Alt+W repeats the last search"],
          ["Ctrl+\\", "Replace: type the search, then the replacement, then Y / N / A (all) per match"],
          ["Alt+R (in the search prompt)", "Toggle regular expressions"],
          ["Alt+C (in the search prompt)", "Toggle case-sensitive"],
          ["Alt+B (in the search prompt)", "Search backwards"]
        ],
        tip: "A = replace all remaining matches",
        tags: ["search", "find", "replace", "regex"]
      },
      {
        id: "nano-cut-paste",
        desc: "Cut, copy and paste whole lines; undo and redo",
        cmd: "Ctrl+K  ·  Alt+6  ·  Ctrl+U",
        flags: [
          ["Ctrl+K", "Cut the current line (press repeatedly to cut several lines into one clipboard)"],
          ["Alt+6", "Copy the current line"],
          ["Ctrl+U", "Paste (Uncut) what you cut or copied"],
          ["Alt+A", "Set a mark: move the cursor to select a region, then Ctrl+K or Alt+6 acts on it"],
          ["Alt+U / Alt+E", "Undo / redo"]
        ],
        tip: "Ctrl+K several times, then Ctrl+U = move a block",
        tags: ["cut", "copy", "paste", "undo", "redo", "mark"]
      },
      {
        id: "nano-navigate",
        desc: "Jump around a long file",
        cmd: "Ctrl+_  (go to line)",
        flags: [
          ["Ctrl+_ or Alt+G", "Go to line (and column: 120,8)"],
          ["Alt+\\ / Alt+/", "Top / bottom of the file"],
          ["Ctrl+C", "Show the current line and column"],
          ["Ctrl+Y / Ctrl+V", "Page up / page down"],
          ["Line numbers", "Toggle them with the key listed under Ctrl+G (Alt+N in current nano)"]
        ],
        tip: "Ctrl+G lists the keys of your exact version",
        tags: ["navigate", "go to line", "page", "position"]
      },
      {
        id: "nano-nanorc",
        desc: "~/.config/nano/nanorc: sensible defaults for config files",
        cmd: `set linenumbers
set mouse
set autoindent
set tabsize 4
set tabstospaces
set constantshow
include "/usr/share/nano/*.nanorc"`,
        flags: [
          ["~/.config/nano/nanorc", "Your settings (~/.nanorc also works); /etc/nanorc is the system-wide one"],
          ["tabstospaces", "Typed tabs become spaces: YAML and most configs want that"],
          ["constantshow", "Always show the cursor position in the status bar"],
          ["include …*.nanorc", "Syntax colouring for many file types (shipped with the nano package)"]
        ],
        tip: "One file, every server: keep it in your dotfiles",
        tags: ["nanorc", "config", "syntax", "tabs", "dotfiles"]
      },
      {
        id: "nano-default-editor",
        desc: "Make nano (or any editor) the default for git, crontab and visudo",
        cmd: "export EDITOR=nano VISUAL=nano",
        flags: [
          ["EDITOR / VISUAL", "Most tools (crontab -e, visudo, git, sudoedit) read these; put the line in ~/.bashrc"],
          ["git config --global core.editor nano", "Only git"],
          ["sudo update-alternatives --config editor", "System-wide default on Debian/Ubuntu (changes state)"]
        ],
        tip: "Set EDITOR in ~/.bashrc",
        tags: ["editor", "default", "git", "crontab", "visudo"]
      }
    ],
    proTip: {
      desc: "Change a config the safe way",
      cmd: "sudo cp -a FILE FILE.bak.$(date +%F) && sudoedit FILE",
      details: "Keep a dated copy, edit with sudoedit, validate with the service's own checker (sshd -t, nginx -t, visudo -c, findmnt --verify), and only then reload the service.",
      flags: [["cp -a", "Keeps owner, mode and timestamps"], ["Validate first", "A typo in sshd_config plus a restart can lock you out of the box"]],
      tip: "Backup → edit → validate → reload"
    }
  },
  {
    id: "vscode", group: "gui", file: "vscode", badge: "code", code: "code",
    name: "VS Code", navDesc: "palette, navigation, multi-cursor, CLI, Remote-SSH",
    title: "VS Code (Linux): Shortcuts, Code Navigation, the code CLI & Remote-SSH",
    subtitle: "Default Linux keys for the moves you use daily, the code command line, and editing on a server over SSH",
    commands: [
      {
        id: "vscode-palette",
        desc: "Command Palette and Quick Open: find any command or file",
        cmd: "Ctrl+Shift+P  ·  Ctrl+P",
        flags: [
          ["Ctrl+Shift+P (or F1)", "Command Palette: every command by name"],
          ["Ctrl+P", "Quick Open a file by name; type : for a line, @ for a symbol, > for commands"],
          ["Ctrl+,", "Settings"],
          ["Ctrl+K Ctrl+S", "Keyboard Shortcuts editor (a chord: press Ctrl+K, release, then Ctrl+S)"]
        ],
        tip: "Forgot a key? Search the palette",
        tags: ["command palette", "quick open", "settings", "shortcuts"]
      },
      {
        id: "vscode-panels",
        desc: "Show and hide the panels",
        cmd: "Ctrl+B  ·  Ctrl+`",
        flags: [
          ["Ctrl+B", "Toggle the sidebar"],
          ["Ctrl+`", "Toggle the integrated terminal"],
          ["Ctrl+Shift+E", "Explorer"],
          ["Ctrl+Shift+F / Ctrl+Shift+H", "Search / replace across files"],
          ["Ctrl+Shift+G", "Source Control (git)"],
          ["Ctrl+Shift+X", "Extensions"]
        ],
        tip: "Ctrl+` keeps a shell one key away",
        tags: ["sidebar", "terminal", "explorer", "search", "git"]
      },
      {
        id: "vscode-navigate",
        desc: "Move through code: definitions, symbols, lines",
        cmd: "F12  ·  Ctrl+Shift+O  ·  Ctrl+G",
        flags: [
          ["F12", "Go to definition"],
          ["Ctrl+Shift+F10", "Peek definition (Linux; Alt+F12 on Windows)"],
          ["F2", "Rename a symbol everywhere"],
          ["Ctrl+Shift+O", "Go to a symbol in this file"],
          ["Ctrl+T", "Go to a symbol in the workspace"],
          ["Ctrl+G", "Go to line"]
        ],
        tip: "F12 in, Ctrl+Alt+- back",
        tags: ["definition", "symbol", "rename", "go to line"]
      },
      {
        id: "vscode-multicursor",
        desc: "Multi-cursor and line editing",
        cmd: "Ctrl+D  ·  Shift+Alt+Down",
        flags: [
          ["Ctrl+D", "Select the next occurrence (repeat to add more cursors)"],
          ["Ctrl+Shift+L", "Select all occurrences"],
          ["Shift+Alt+Up / Down", "Add a cursor above / below (Linux; Ctrl+Alt on Windows)"],
          ["Alt+Up / Down", "Move the line up / down"],
          ["Ctrl+Shift+Alt+Down", "Copy the line down (Linux)"],
          ["Ctrl+/", "Toggle a line comment"],
          ["Ctrl+Shift+I", "Format the document (Linux; Shift+Alt+F on Windows)"]
        ],
        tip: "Ctrl+D is the fastest bulk rename",
        tags: ["multi-cursor", "select", "move line", "comment", "format"]
      },
      {
        id: "vscode-layout",
        desc: "Split, close and focus",
        cmd: "Ctrl+\\  ·  Ctrl+W  ·  Ctrl+K Z",
        flags: [
          ["Ctrl+\\", "Split the editor"],
          ["Ctrl+W", "Close the editor"],
          ["Ctrl+K Z", "Zen mode; Esc Esc leaves it"]
        ],
        tip: "Zen mode for long write-ups",
        tags: ["split", "close", "zen", "layout"]
      },
      {
        id: "vscode-cli",
        desc: "The code command: open, jump to a line, diff",
        cmd: "code -r -g /etc/netplan/50-cloud-init.yaml:12",
        flags: [
          ["code .", "Open the current folder"],
          ["-g / --goto file:line[:col]", "Open at a line, e.g. straight from a compiler or log error"],
          ["-r / --reuse-window", "Use the window that is already open"],
          ["-n / --new-window", "Force a new window"],
          ["-d / --diff A B", "Side-by-side diff of two files"],
          ["-w / --wait", "Return only when the file is closed (needed as a git editor)"]
        ],
        subcommands: [
          ["code --diff running.conf backup.conf", "Compare two configs"],
          ["git config --global core.editor \"code --wait\"", "VS Code for commit messages and rebases"],
          ["code --list-extensions --show-versions", "What is installed (and which versions)"],
          ["code --install-extension ms-vscode-remote.remote-ssh", "Install an extension by ID (changes state)"]
        ],
        tip: "core.editor needs --wait",
        tags: ["code", "cli", "diff", "goto", "git", "extensions"]
      },
      {
        id: "vscode-remote",
        desc: "Edit files on a server over SSH (Remote-SSH)",
        cmd: "Ctrl+Shift+P → Remote-SSH: Connect to Host...",
        flags: [
          ["Remote-SSH extension", "Runs a small VS Code server on the target; files, terminal and search work as if local"],
          ["~/.ssh/config", "Hosts you define there (Host, HostName, User, ProxyJump) appear in the host list"],
          ["ProxyJump jumpbox", "Reach lab nodes through the jumpbox without extra tunnels"],
          ["code --remote ssh-remote+HOST /path", "The same from the command line"],
          ["code tunnel", "Alternative when inbound SSH is blocked: the machine connects out (needs sign-in)"]
        ],
        tip: "Define hosts in ~/.ssh/config once",
        tags: ["remote", "ssh", "remote-ssh", "tunnel", "jumpbox"]
      }
    ],
    proTip: {
      desc: "VS Code 1.145 (November 2026): keys above are the Linux defaults",
      cmd: "Ctrl+K Ctrl+S",
      details: "Linux, Windows and macOS defaults differ (peek, format, add-cursor). The Keyboard Shortcuts editor shows what your install actually uses and lets you search by key.",
      flags: [["Search by key", "Click the keyboard icon in the editor and press the combo"], ["Settings Sync", "Sign in once and keybindings follow you to other machines"]],
      tip: "Check your own bindings with Ctrl+K Ctrl+S"
    }
  },
  {
    id: "zed", group: "gui", file: "zed", badge: "zed", code: "zed",
    name: "Zed", navDesc: "fast native editor, agent panel",
    title: "Zed (Linux): Default Keys, Panels, Agent & the zed CLI",
    subtitle: "Zed's default Linux keymap (VS Code-like), where its settings and keymap live, the agent panel and inline assist",
    commands: [
      {
        id: "zed-palette",
        desc: "Command palette, file finder, settings and keymap",
        cmd: "ctrl-shift-p  ·  ctrl-p",
        flags: [
          ["ctrl-shift-p (or f1)", "Command palette"],
          ["ctrl-p (or ctrl-e)", "File finder"],
          ["ctrl-,", "Settings window"],
          ["ctrl-alt-,", "Open the settings file (JSON)"],
          ["ctrl-k ctrl-s", "Keymap editor"]
        ],
        tip: "zed: open default keymap shows every binding",
        tags: ["palette", "file finder", "settings", "keymap"]
      },
      {
        id: "zed-panels",
        desc: "Docks, terminal and project search",
        cmd: "ctrl-b  ·  ctrl-`",
        flags: [
          ["ctrl-b", "Toggle the left dock"],
          ["ctrl-shift-e", "Project panel (file tree)"],
          ["ctrl-`", "Toggle the terminal panel"],
          ["ctrl-j", "Toggle the bottom dock"],
          ["ctrl-shift-f / ctrl-shift-h", "Search / replace across the project"]
        ],
        tip: "Same keys as VS Code by default",
        tags: ["dock", "terminal", "project", "search"]
      },
      {
        id: "zed-navigate",
        desc: "Definitions, references, symbols",
        cmd: "f12  ·  alt-shift-f12",
        flags: [
          ["f12", "Go to definition"],
          ["alt-shift-f12", "Find all references"],
          ["f2", "Rename symbol"],
          ["ctrl-shift-o", "Outline: symbols in this file"],
          ["ctrl-t", "Symbols across the project"],
          ["ctrl-g", "Go to line"]
        ],
        tip: "ctrl-shift-o for a quick file outline",
        tags: ["definition", "references", "symbols", "go to line"]
      },
      {
        id: "zed-editing",
        desc: "Multi-cursor and line editing",
        cmd: "ctrl-d  ·  shift-alt-down",
        flags: [
          ["ctrl-d", "Select the next occurrence"],
          ["shift-alt-up / shift-alt-down", "Add a cursor above / below"],
          ["alt-up / alt-down", "Move the line"],
          ["ctrl-alt-shift-up / down", "Duplicate the line"],
          ["ctrl-/", "Toggle comment"],
          ["ctrl-shift-i", "Format"],
          ["ctrl-\\ / ctrl-w", "Split right / close the tab"]
        ],
        tip: "Muscle memory from VS Code carries over",
        tags: ["multi-cursor", "move line", "duplicate", "comment", "format", "split"]
      },
      {
        id: "zed-agent",
        desc: "AI: agent panel and inline assist",
        cmd: "ctrl-?  ·  ctrl-enter",
        flags: [
          ["ctrl-?", "Toggle the agent panel"],
          ["ctrl-enter (in the editor)", "Inline assist on the selection or the current line"],
          ["Providers", "Configure models in the agent panel's settings"]
        ],
        tip: "Select code first, then ctrl-enter",
        tags: ["ai", "agent", "inline assist", "assistant"]
      },
      {
        id: "zed-cli",
        desc: "The zed command: open a folder, a line, a diff",
        cmd: "zed /etc/netplan/50-cloud-init.yaml:12:5",
        flags: [
          ["zed ~/projects/repo", "Open a folder as a workspace"],
          ["zed file:42 / file:42:10", "Open at a line (and column)"],
          ["--diff OLD NEW", "Diff two files"],
          ["-n / -a / -r", "New window / add to the current workspace / reuse the window"],
          ["-w / --wait", "Wait for the file to close (for git core.editor)"],
          ["zeditor", "Some Linux packages name the binary zeditor instead of zed"]
        ],
        subcommands: [["git config --global core.editor \"zed --wait\"", "Zed for commit messages"], ["zed --version", "Installed version"]],
        tip: "core.editor needs --wait",
        tags: ["zed", "cli", "diff", "git"]
      },
      {
        id: "zed-config",
        desc: "Keymap file, base keymap and vim mode",
        cmd: "~/.config/zed/keymap.json",
        flags: [
          ["~/.config/zed/keymap.json", "Your bindings (Linux); they take precedence over the defaults"],
          ["zed: toggle base keymap selector", "Switch the base keymap: VS Code (default), JetBrains, Emacs (beta)…"],
          ["\"vim_mode\": true", "Vim keys, set in settings.json (open it with ctrl-alt-,)"]
        ],
        tip: "Keymap editor writes keymap.json for you",
        tags: ["keymap", "settings", "vim", "base keymap", "config"]
      }
    ],
    proTip: {
      desc: "Zed 1.27 (November 2026): check the bindings your build ships",
      cmd: "ctrl-shift-p → zed: open default keymap",
      details: "Zed updates often. The default keymap file is the source of truth for every action and its key; search it for an action name to find its binding.",
      flags: [["Actions", "There is no separate action list: the palette and the default keymap are it"], ["Linux vs macOS", "These are the Linux keys; macOS uses cmd"]],
      tip: "The default keymap is the reference"
    }
  },
  {
    id: "cursor", group: "gui", file: "cursor", badge: "cur", code: "cur",
    name: "Cursor", navDesc: "AI editor: agent, inline edit, CLI agent",
    title: "Cursor: Agent Side Panel, Chat Keys, Tab & the agent CLI",
    subtitle: "Cursor's AI keys and its terminal agent. Cursor is built on VS Code, so the VS Code sheet's keys work here too",
    commands: [
      {
        id: "cursor-panel",
        desc: "Open the agent side panel and switch modes and models",
        cmd: "Ctrl+I  ·  Ctrl+.  ·  Shift+Tab",
        flags: [
          ["Ctrl+I (also Ctrl+L / Ctrl+K)", "Toggle the side panel (unless you bound a key to a mode)"],
          ["Ctrl+E", "Toggle the agent layout"],
          ["Ctrl+.", "Mode menu"],
          ["Shift+Tab", "Rotate between agent modes"],
          ["Ctrl+/", "Loop between AI models"],
          ["Linux keys", "Cursor's reference lists macOS keys; on Linux and Windows Ctrl takes the place of Cmd"]
        ],
        tip: "Shift+Tab to switch Agent / Plan / Ask",
        tags: ["agent", "side panel", "mode", "model"]
      },
      {
        id: "cursor-chat",
        desc: "In the chat box: send, cancel, accept or reject changes",
        cmd: "Ctrl+Enter  ·  Ctrl+Shift+Backspace",
        flags: [
          ["Enter", "Queue the message (default)"],
          ["Ctrl+Enter while typing", "Send now"],
          ["Ctrl+Shift+Backspace", "Cancel the generation"],
          ["Ctrl+Enter with suggested changes", "Accept all changes"],
          ["Ctrl+Shift+Backspace with suggested changes", "Reject all changes"],
          ["Ctrl+N / Ctrl+T / Ctrl+W", "New chat / new chat tab / close the chat"]
        ],
        tip: "Review the diff before accepting all",
        tags: ["chat", "send", "accept", "reject", "cancel"]
      },
      {
        id: "cursor-context",
        desc: "Give the agent context: selections, files, clipboard",
        cmd: "Ctrl+Shift+L  ·  @",
        flags: [
          ["Ctrl+Shift+L", "Add the selected code to the chat"],
          ["@", "Mention files, folders, docs and more"],
          ["/", "Shortcut commands"],
          ["Ctrl+V (code or log in clipboard)", "Paste it as context; Ctrl+Shift+V pastes it as plain text"]
        ],
        tip: "@-mention the file instead of pasting it",
        tags: ["context", "mention", "selection", "clipboard"]
      },
      {
        id: "cursor-tab",
        desc: "Tab completions",
        cmd: "Tab  ·  Ctrl+→",
        flags: [["Tab", "Accept the suggestion"], ["Ctrl+→", "Accept the next word only"]],
        tip: "Ctrl+→ takes it one word at a time",
        tags: ["tab", "completion", "suggestion"]
      },
      {
        id: "cursor-settings",
        desc: "Settings, palette, keyboard shortcuts, voice",
        cmd: "Ctrl+Shift+J  ·  Ctrl+Shift+P",
        flags: [
          ["Ctrl+Shift+J", "Cursor settings (models, rules, privacy)"],
          ["Ctrl+,", "General (VS Code) settings"],
          ["Ctrl+Shift+P", "Command palette"],
          ["Ctrl+R then Ctrl+S", "Keyboard shortcuts editor (or search Keyboard Shortcuts in the palette)"],
          ["Ctrl+Shift+Space", "Voice mode (dictation)"]
        ],
        tip: "Ctrl+Shift+J is Cursor's own settings",
        tags: ["settings", "palette", "shortcuts", "voice"]
      },
      {
        id: "cursor-agent-cli",
        desc: "Run the Cursor agent in a terminal (agent CLI)",
        cmd: "agent \"explain why this service fails to start\"",
        flags: [
          ["agent", "Interactive session in the current directory"],
          ["-p \"…\" --output-format text", "Print mode: one answer to stdout, for scripts"],
          ["--mode=plan / --mode=ask", "Plan without editing, or just answer questions"],
          ["agent ls / agent resume / --continue", "List, resume or continue earlier sessions"],
          ["--sandbox enabled", "Run tool calls in the sandbox"]
        ],
        subcommands: [
          ["curl https://cursor.com/install -fsS | bash", "Install the CLI (pipes a script into bash: read it first; changes state)"],
          ["agent -p \"review these changes for security issues\" --output-format text", "Non-interactive review"]
        ],
        tip: "-p for scripts, plain agent for a chat",
        tags: ["cli", "agent", "terminal", "print mode"]
      }
    ],
    proTip: {
      desc: "Keys change often: check Cursor's own list",
      cmd: "Ctrl+R Ctrl+S",
      details: "Cursor ships updates weekly (changelog entries on Nov 5 and 6, 2026 alone). The keyboard shortcuts editor shows your build's bindings; everything not AI-specific behaves like VS Code.",
      flags: [["VS Code sheet", "Navigation, multi-cursor and Remote-SSH keys are the same"], ["Rules", "Project rules guide the agent; keep secrets out of prompts and rules"]],
      tip: "AI keys here, editing keys on the VS Code sheet"
    }
  }
];

// 2. Menu. build-nav-groups.js files it under the Editors tab.
const navCol = (group, heading) => `                    <div class="ed-dropdown-col">
                      <div class="ed-dropdown-heading">${heading}</div>
${EDITOR_SECTIONS.filter(s => s.group === group).map(s => `                      <a href="${s.file}.html" class="dropdown-item" role="menuitem">${LOGOS[s.id] || ''} <code>${s.code}</code> <span class="cmd-desc">${escapeHtml(s.name)}: ${escapeHtml(s.navDesc)}</span></a>`).join('\n')}
                    </div>`;

const ED_NAVBAR_SNIPPET = `<div class="nav-dropdown" id="editors-nav-dropdown">
                <a href="editors.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/><path d="M13.5 4l-3 16" stroke="#a78bfa"/></svg>
                  <span>Editors</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu ed-dropdown-menu" role="menu">
                  <a href="editors.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Editors Hub</a>
                  <div class="dropdown-divider"></div>
                  <div class="ed-dropdown-grid">
${navCol('terminal', 'Terminal')}
${navCol('gui', 'GUI &amp; AI')}
                  </div>
                </div>
              </div>
              `;

// 3. Insert (or replace) the menu in every page; the nav builder moves it into its tab.
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html');
const existingDropdown = /<div class="nav-dropdown" id="editors-nav-dropdown">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*/;
const homeLink = /<a href="index\.html" class="sheet-link nav-home(?: active)?">/;
let navUpdated = 0, navMissing = [];
for (const file of htmlFiles) {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  if (!/<nav class="sheet-switcher"/.test(content)) continue;
  const before = content;
  if (existingDropdown.test(content)) content = content.replace(existingDropdown, ED_NAVBAR_SNIPPET);
  else if (homeLink.test(content)) content = content.replace(homeLink, m => ED_NAVBAR_SNIPPET + m);
  else { navMissing.push(file); continue; }
  if (content !== before) { fs.writeFileSync(p, content, 'utf8'); navUpdated++; }
}
console.log(`Editors menu written into ${navUpdated} sheet(s)` + (navMissing.length ? `; no insertion point in: ${navMissing.join(', ')}` : ''));

// New pages copy the nav from index.html.
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Split one section into cards: main command, extra flags, recipes, pro tip.
const isMultiline = s => /\n/.test(s || '');
function buildSectionCards(sec) {
  const cards = [];
  const baseTags = ['editor', 'editors', sec.id];
  sec.commands.forEach((cmd, cIdx) => {
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: sec.badge,
      title: `${sec.name}: ${cmd.desc.split('(')[0].split(':')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [{
        id: cmd.id, desc: cmd.desc, cmd: cmd.cmd, details: cmd.details || '',
        flags: cmd.flags ? cmd.flags.slice(0, 3) : [], tip: cmd.tip || '',
        tags: [...baseTags, ...(cmd.tags || [])]
      }]
    });
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: More options`,
        subtitle: `More options for: ${cmd.desc.split('(')[0].trim()}`,
        commands: [{
          id: `${cmd.id}-flags-card`,
          desc: `More options and gotchas for: ${cmd.desc.split('(')[0].trim()}`,
          cmd: cmd.cmd, hideCode: isMultiline(cmd.cmd),
          flags: cmd.flags.slice(3),
          tags: [...baseTags, 'flags', 'options', ...(cmd.tags || []).slice(0, 3)]
        }]
      });
    }
    if (cmd.subcommands && cmd.subcommands.length) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: Related commands`,
        subtitle: `Related commands for: ${cmd.desc.split('(')[0].trim()}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`, desc: sub[1], cmd: sub[0],
          tags: [...baseTags, 'recipe', ...(cmd.tags || []).slice(0, 3)]
        }))
      });
    }
  });
  if (sec.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${sec.name}: Pro Tip`,
      subtitle: sec.proTip.desc,
      commands: [{
        id: `${sec.id}-tips-card`, desc: sec.proTip.desc, cmd: sec.proTip.cmd,
        details: sec.proTip.details, flags: sec.proTip.flags, tip: sec.proTip.tip,
        tags: [...baseTags, 'tips', 'best-practice']
      }]
    });
  }
  return cards;
}

// 5. Sheet JS: data plus the shared render/search/bookmark code used by the other suites.
function generateSheetJs(varName, title, cards, fileKey) {
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Editors: ${title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
}

// Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : "";
        return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = ${varName};
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' items)</option>'
  ];

  for (const card of allCards) {
    const isSelected = state.activeCategory === card.id ? " selected" : "";
    optionsHtml.push(
      '<option value="' + escapeHtml(card.id) + '"' + isSelected + '>' +
      escapeHtml(card.title) + ' (' + card.commands.length + ')' +
      '</option>'
    );
  }

  const resetBtnHtml = state.activeCategory !== "all"
    ? '<button type="button" class="cat-reset-btn" id="cat-reset-btn" title="Show all topics">✕ Show All</button>'
    : "";

  categoryTabsEl.innerHTML =
    '<div class="cat-dropdown-wrap">' +
      '<label class="cat-dropdown-label" for="category-select">Topic:</label>' +
      '<select id="category-select" class="cat-select" aria-label="Filter by topic">' +
        optionsHtml.join("") +
      '</select>' +
      resetBtnHtml +
    '</div>';

  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const catReset = document.getElementById("cat-reset-btn");
  if (catReset) {
    catReset.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmd, searchTerms) {
  if (!searchTerms.length) return true;
  const target = [
    cmd.cmd || "",
    cmd.desc || "",
    cmd.details || "",
    cmd.tip || "",
    (cmd.tags || []).join(" "),
    (cmd.flags || []).map(([f, d]) => f + " " + d).join(" ")
  ].join(" ").toLowerCase();

  return searchTerms.every(term => target.includes(term));
}

let allRenderedCards = [];
function packMasonry() {
  if (!sectionsContainer) return;
  if (sectionsContainer.querySelectorAll(".section-card").length === 0) {
    allRenderedCards = [];
    return;
  }
  const directCards = [...sectionsContainer.querySelectorAll(":scope > .section-card")];
  if (directCards.length > 0) {
    allRenderedCards = directCards;
  }
  if (allRenderedCards.length === 0) return;

  const containerWidth = sectionsContainer.clientWidth || window.innerWidth;
  const colCount = Math.max(1, Math.min(allRenderedCards.length, Math.floor((containerWidth + 18) / (380 + 18))));
  if (colCount <= 1) {
    sectionsContainer.classList.remove("has-masonry");
    sectionsContainer.replaceChildren(...allRenderedCards);
    return;
  }

  sectionsContainer.classList.add("has-masonry");

  const cols = Array.from({ length: colCount }, () => {
    const col = document.createElement("div");
    col.className = "masonry-col";
    return col;
  });
  const colHeights = new Array(colCount).fill(0);
  sectionsContainer.replaceChildren(...cols);

  for (const card of allRenderedCards) {
    let shortestIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (colHeights[i] < colHeights[shortestIdx]) {
        shortestIdx = i;
      }
    }
    cols[shortestIdx].appendChild(card);
    colHeights[shortestIdx] += card.offsetHeight + 18;
  }
}

let masonryResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
      .filter(Boolean);

    const filteredCommands = card.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? '<div class="flag-pills">' + cmd.flags.map(([f, d]) =>
            '<span class="flag-pill"><strong class="flag-token">' + escapeHtml(f) + '</strong> <span class="flag-desc">' + escapeHtml(d) + '</span></span>'
          ).join("") + '</div>'
        : "";

      const detailsHtml = cmd.details
        ? '<p class="cmd-details">' + escapeHtml(cmd.details) + '</p>'
        : "";

      const tipHtml = cmd.tip
        ? '<div class="cmd-tip"><span class="tip-badge">TIP</span>' + escapeHtml(cmd.tip) + '</div>'
        : "";

      const copyTarget = cmd.cmd.includes("   |   ")
        ? cmd.cmd.split("   |   ")[0].trim()
        : cmd.cmd.trim();

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\\n");

      return [
        '<div class="cmd-item" id="cmd-' + escapeHtml(cmd.id) + '" data-cmd-id="' + escapeHtml(cmd.id) + '">',
        '  <div class="cmd-header-row">',
        '    <div class="cmd-desc">',
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  ' + codeBoxHtml,
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\\n");
    }).join("\\n");

    cardsHtml.push([
      '<article class="section-card" id="sec-' + escapeHtml(card.id) + '">',
      '  <header class="section-header">',
      '    <div class="section-title-wrap">',
      '      <span class="section-badge">' + escapeHtml(card.badge) + '</span>',
      '      <div>',
      '        <h2 class="section-title">' + escapeHtml(card.title) + '</h2>',
      '        <p class="section-subtitle">' + escapeHtml(card.subtitle) + '</p>',
      '      </div>',
      '    </div>',
      '    <span class="count-badge">' + filteredCommands.length + '</span>',
      '  </header>',
      '  <div class="command-list">',
      commandsHtml,
      '  </div>',
      '</article>'
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  packMasonry();
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox) {
      const cmdText = codeBox.getAttribute("data-cmd");
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
`;
}

// 6. HTML page. Mirrors the chrome of the current live sheets (theme menu, density
// toggle); common.js adds the header search pill, rail and tools at runtime.
function generateSheetHtml(o) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(o.docTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">${escapeHtml(o.prompt)}</span><span class="cursor-block">${escapeHtml(o.cursor)}</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(o.h1)}</h1>
            <span class="version-pill">${escapeHtml(o.pill)}</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(o.subtitle)}</p>
        </div>
      </div>
      <div class="header-actions">
        <button
          type="button"
          id="density-toggle"
          class="action-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>
        <div class="theme-menu-wrapper" id="theme-menu-wrapper">
          <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Select Color Theme" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2h2.5c3.6 0 6.5-2.9 6.5-6.5C22 5.6 17.5 2 12 2z"></path>
            </svg>
            <span id="theme-btn-label">Theme</span>
            <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>
  </header>
  <main class="container main-layout">
    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>
    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(o.h1)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>
  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>
  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(o.h1)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>
  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${o.fileKey}.js"></script>
</body>
</html>
`;
}


// 7. Write each sheet, then the hub (every card from every sheet).
const PILLS = { nano: 'GNU nano 9.2', vscode: 'VS Code 1.145 · Linux keys', zed: 'Zed 1.27 · Linux keys', cursor: 'Cursor · Nov 2026' };
const writeSheet = (fileKey, varName, title, cards, page) => {
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), generateSheetJs(varName, title, cards, fileKey), 'utf8');
  const htmlPath = path.join(__dirname, `${fileKey}.html`);
  if (!fs.existsSync(htmlPath)) fs.writeFileSync(htmlPath, generateSheetHtml({ ...page, fileKey }), 'utf8');
  console.log(`${fileKey}.js (${cards.length} cards)`);
};

const allCards = [];
for (const sec of EDITOR_SECTIONS) {
  const cards = buildSectionCards(sec);
  allCards.push(...cards);
  writeSheet(sec.file, `ED_${sec.file.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`, sec.title, cards, {
    docTitle: `Editors: ${sec.name} — ${sec.title}`,
    prompt: 'ED', cursor: '|', h1: sec.name, pill: PILLS[sec.id], subtitle: sec.subtitle
  });
}
writeSheet('editors', 'EDITORS_CHEAT_SHEET_DATA', 'Editors Hub (nano, VS Code, Zed, Cursor)', allCards, {
  docTitle: 'Editors: nano, VS Code, Zed & Cursor Hub',
  prompt: 'ED', cursor: '|', h1: 'Editors', pill: 'nano · VS Code · Zed · Cursor',
  subtitle: 'Edit configs on a server with nano, and the keys and CLIs of VS Code, Zed and Cursor (Neovim has its own suite)'
});
console.log(`\nEditors suite: ${EDITOR_SECTIONS.length} sheets + hub.`);
