/** @param {NS} ns **/ export async function main(ns) {
  document.getElementById('unclickable').style =
    'display: block;position: absolute;top: 0;left: 0;width: 1000px;height: 1000px;z-index: 10000;background: blue;';
  document.getElementById('unclickable').parentNode.addEventListener(
    'click',
    () => {
      document.getElementById('unclickable').style = 'display: none; visibility: hidden;';
    },
    true,
  );
}
