const LinkCycler = ({ currentLink }) => {
  const links = [
    <div className="placeholder"></div>,
    <a href="https://www.instagram.com/wittenbrookart/" target="_blank">Art Instagram</a>,
    <a href="boulders.html" title="boulder smasher" target="_blank">Boulder Smasher</a>,
    <a href="http://japanblog.nataliewittenbrook.com/tagged/natinjapan/chrono" target="_blank" title="japan blog">Japan Blog</a>
  ]
  return links[currentLink];
};

export default LinkCycler;