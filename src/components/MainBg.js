const MainBg = () => (
  <div className="mainBg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      className="mainBgStripes"
    >
      <defs>
        <pattern
          id="pattern_jyUjl"
          patternUnits="userSpaceOnUse"
          width="5"
          height="5"
          patternTransform="rotate(90)"
        >
          <line x1="0" y="0" x2="0" y2="5" stroke="#11693d" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern_jyUjl)" opacity="1" />
    </svg>
    <div className="mainBgVignette" />
  </div>
);
export default MainBg;
