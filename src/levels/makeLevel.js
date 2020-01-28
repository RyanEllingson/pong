export default function makeLevel(level) {
return level.reduce((acc, cur, y) => {
    const blocks = cur.split("").reduce((bs, b, x) => {
      if (b === " ") {
        return [...bs];
      }
      return [
        ...bs,
        {
          type: b,
          x: x * 10,
          y: y * 10,
          width: 10,
          height: 10
        }
      ];
    }, []);
    return [...acc, ...blocks];
  }, []);
}