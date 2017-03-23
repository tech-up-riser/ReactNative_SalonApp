export default function () {
  Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
  }
}