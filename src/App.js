import { useState } from 'react';
import './App.scss';
import LinkCycler from './LinkCycler';

function App() {
  const [currentLink, setCurrentLink] = useState(0);

  const showLink = () => {
    // value temporarily hardcoded
    if (currentLink < 3) {
      setCurrentLink(currentLink + 1);
    } else {
      setCurrentLink(0);
    }
    return currentLink;
  };

  return (
    <div className="site-wrapper">
      <div className="content-wrapper">
        <div className="content">
          <h1>Hi! I'm Natalie.</h1>		
          <p>I am a Frontend Software Engineer located in Seattle, WA.</p>
          <p>I'm originally from San Francisco, CA.</p>
          <p>Are you looking for my <a href="http://www.linkedin.com/in/wittenbrook" title="LinkedIn" target="_blank">LinkedIn</a> or <button className="button" onClick={() => showLink()}>something else?</button></p>
          <div className="links">
            <LinkCycler currentLink={currentLink} />
          </div>
        </div>
      </div>      
    </div>
  );
}

export default App;
