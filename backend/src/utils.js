// Clean instance name
export const cleanInstanceName = (name) => {
  // Trim any leading or trailing spaces
  name = name.trim();

  // Replace escape sequences to match SDF format
  name = name.replace(/\\\$/g, '$');
  name = name.replace(/\\\./g, '.');
  name = name.replace(/\\:/g, ':');
  name = name.replace(/\\~/g, '~');
  name = name.replace(/\\\^/g, '^');

  return name;
}