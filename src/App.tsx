import * as React from 'react';
import './App.css';
import { string } from 'prop-types';
import CV from './pages/CV';
import Binaural from './pages/Binaural';
import Caleidonote from './pages/Caleidonote';
import Intro from './pages/Intro';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

enum Section
{
  INTRO = "Intro",
  CALEIDONOTE = "Caleidonote",
  BINAURAL = "Binaural",
  CV = "CV" 
}

type AppStatus = {
  section: Section,
  forced: boolean,
  sideBarExpanded: boolean  
}

class App extends React.Component<{}, AppStatus> {
  constructor(props: any)
  {
    super(props);
    let section = Section.INTRO;
    let forced = true;
    switch (window.location.pathname)
    {      
      case "/caleidonote": section = Section.CALEIDONOTE; break;
      case "/binaural": section = Section.BINAURAL; break;
      case "/CV": section = Section.CV; break;
      default: forced = false; break;
    }
    this.state = {section: section, forced: forced, sideBarExpanded: true};
    
  }
  

  switchTo (newSection: Section) 
  {
    //console.log("switching to :" + newSection);
    this.setState({section: newSection});
  }

  toggleCollapse () 
  {
    this.setState({sideBarExpanded: !this.state.sideBarExpanded});
  }

  render() {
    let el;
    //console.log("rendered");
    switch (this.state.section)
    {
      case Section.CALEIDONOTE:
        el = <Caleidonote/>;
        break;
      case Section.BINAURAL:
        el = <Binaural/>; break;
      case Section.CV:
        el = <CV/>;
        break;
      case Section.INTRO:
        el = <Intro/>;
        break;
    }

    if ( this.state.forced )
    {
      return el;
    }

    let buttons : any[] = [];
    Object.keys(Section).forEach( key => {
        let val = Section[key as any] as Section;
        let className = "barItem button";
        if (val == this.state.section)
        {
          className += " current";
        }
        buttons.push(
          <a key={key} className={className} onClick={((event: any) => this.switchTo(val)) }>{val}</a>
        )
      }
    );
 
    let sideBarClass = "sideBar";
    let appBodyClass = "appBody";
    if (!this.state.sideBarExpanded)
    {
      sideBarClass += " collapsed";
      appBodyClass += " appBodyExpanded";
    }    
    return (
      <React.Fragment>
          <div className={sideBarClass}>
            {this.state.sideBarExpanded && <a className="hideMenuButton" onClick={((event: any) => this.toggleCollapse())}><FaAngleLeft/></a>}
            <h3 className="barItem">Menu</h3>
            {buttons.map(bt => bt)}
          </div>
          {!this.state.sideBarExpanded && <a className="showMenuButton" onClick={((event: any) => this.toggleCollapse())}><FaAngleRight/></a>}
            
          <div className={appBodyClass}>
          {el}
          </div>
      </React.Fragment>
    );
  }
}

export default App;
