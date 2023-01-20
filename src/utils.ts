export class utils {
  static slugify(string: string) {
    const a =
      'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:';
    const b =
      'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  static eadortsu() {
    return (
      '\n' +
      '  ______               _                  _                 \n' +
      ' |  ____|             | |                | |                \n' +
      ' | |__      __ _    __| |   ___    _ __  | |_   ___   _   _ \n' +
      " |  __|    / _` |  / _` |  / _ \\  | '__| | __| / __| | | | |\n" +
      ' | |____  | (_| | | (_| | | (_) | | |    | |_  \\__ \\ | |_| |\n' +
      ' |______|  \\__,_|  \\__,_|  \\___/  |_|     \\__| |___/  \\__,_|\n' +
      '                                                            \n' +
      '                                                            \n'
    );
  }

  static isValidHttpUrl(string: string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }
}
