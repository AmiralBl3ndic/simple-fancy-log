const log = require("fancy-log"); // So that we have the time in the log


const colors = {
  default: "\x1b[0m",

  // Foreground
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  cyan: "\x1b[36m",

  // Background
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m"
};



/** Function that converts a tag Object to string
 *
 * @param {Object} tag - Object that represents the tag to add
 * @param {String} tag.content - Content of the tag ("test" yields "[test]")
 * @param {String} [tag.color = "default"] - Foreground color of the tag
 * @param {String} [tag.bgColor = "default"] - Background color of the tag
 */
renderTag = tag => {
  let ret = "";

  if (tag.bgColor !== "") {
    console.debug("Background color set");
    ret += colors[tag.bgColor];
  }


  if (tag.color !== "") {
    console.debug("Foreground color set: '", tag.color, "'");
    ret += colors[tag.color];
  }

  ret += `[${tag.content}]`;

  return ret;
};


/** Function that checks the foreground color of a tag
 *
 * @param {String} fg - Foreground color of the tag
 * @return {String} - The foreground color, once checked
 */
checkForegroundColor = fg => {
  if (typeof(fg) !== "string")
    return "";

  fg = fg.trim();
  if (fg.startsWith("bg"))
    return "";

  if (colors[fg] !== undefined)
    return colors[fg];

  return "";
};


/** Function that checks the foreground color of a tag
 *
 * @param {String} bg - Foreground color of the tag
 * @return {String} - The foreground color, once checked
 */
checkBackgroundColor = bg => {
  if (typeof(bg) !== "string")
    return "";

  bg = bg.trim();

  if (bg.startsWith("bg")) {
    if (colors[bg] !== undefined)
      return colors[bg];

    return "";
  }

  bg = "bg" + bg[0].toUpperCase() + bg.slice(1);

  if (colors[bg] !== undefined)
    return colors[bg];

  return "";
};



class FancyLogger {
  constructor () {
    this._tags = [];
    this._message = "";
  }


  get tags () {
    let line = colors.default;
    for (let tag of this._tags)
      line += renderTag(tag) + colors.default + " ";
    return line;
  }


  set message (val) {
    if (typeof(val) !== "string")
      return;
    this._message = val;
  }


  get message () {
    return this._message;
  }


  /** Function that adds a tag to the current line
   *
   * @param {Object} tag - Object that represents the tag to add
   * @param {String} tag.content - Content of the tag ("test" yields "[test]")
   * @param {String} [tag.color = "default"] - Foreground color of the tag
   * @param {String} [tag.bgColor = "default"] - Background color of the tag
   */
  addTag (tag = {
    color: "",
    bgColor: "",
    content: null
  }) {
    if (!(tag instanceof Object) || tag.content == null || tag.content === undefined)
      return;

    tag.color = checkForegroundColor(tag.color);
    tag.bgColor = checkBackgroundColor(tag.bgColor);
    tag.content = tag.content.trim();

    let exists = false;
    for (let nTag of this._tags)
      if (nTag.color === tag.color && nTag.bgColor === tag.bgColor && nTag.content === tag.content)
        exists = true;

    if (!exists)
      this._tags.push(tag);
  }


  /** Function that adds one or multiple _tags to the current line
   *
   * @param {...Object | Object[]} tags - Object(s) that represents the tag(s) to add
   * @param {String} tags.content - Content of the tag ("test" yields "[test]")
   * @param {String} [tags.color = "default"] - Foreground color of the tag
   * @param {String} [tags.bgColor = "default"] - Background color of the tag
   */
  addTags (tags) {
    let n = arguments.length;

    for (let i = 0; i < n; i++) {
      if (arguments[i] instanceof Array) {
        for (let j = 0; j < arguments[i].length; j++)
          this.addTag(arguments[i][j]);
      }
      else
        this.addTag(arguments[i]);
    }
  }


  /** Function that adds a tag to the current line
   *
   * @param {Object} tag - Object that represents the tag to add
   * @param {String} tag.content - Content of the tag ("test" yields "[test]")
   * @param {String} [tag.color = ""] - Foreground color of the tag
   * @param {String} [tag.bgColor = ""] - Background color of the tag
   */
  removeTag (tag = {
    color: "",
    bgColor: "",
    content: null
  }) {
    if (!(tag instanceof Object) || tag.content == null || tag.content === undefined)
      return;
    tag.color = checkForegroundColor(tag.color);
    tag.bgColor = checkBackgroundColor(tag.bgColor);
    tag.content = tag.content.trim();

    const index = this._tags.indexOf(tag);
    if (index !== -1)
      this._tags.splice(index, 1);
  }


  /** Function that removes one or multiple _tags from the current line
   *
   * @param {...Object | Object[]} tags - Object(s) that represents the tag(s) to remove
   * @param {String} tags.content - Content of the tag ("test" yields "[test]")
   * @param {String} [tags.color = "default"] - Foreground color of the tag
   * @param {String} [tags.bgColor = "default"] - Background color of the tag
   */
  removeTags (tags) {
    let n = arguments.length;

    for (let i = 0; i < n; i++) {
      if (arguments[i] instanceof Array) {
        for (let j = 0; j < arguments[i].length; j++)
          this.removeTag(arguments[i][j]);
      }
      else
        this.removeTag(arguments[i]);
    }
  }


  /** Function that returns the string that will be logged when the log function is called
   *
   * @return {String} - String that will be logged when the log function is called
   */
  toString () {
    return this.tags + " - " + this._message;
  }


  /** Function that logs a message with all the set tags. This function resets the message and the tags after it is displayed
   *
   * @param {String} message - Message to display along with the tags
   */
  log (message) {
    this.message = message;
    log(this.toString());

    this._tags = [];
    this._message = "";
  }
}


module.exports = FancyLogger;



// TEST

const logger = new FancyLogger();

logger.addTag({color: "red", content: "Login"});
logger.log("New connection");