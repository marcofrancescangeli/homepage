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
  sideBarExpanded: boolean
}

class App extends React.Component<{}, AppStatus> {
  constructor(props: any)
  {
    super(props);
    this.state = {section: Section.INTRO, sideBarExpanded: true};
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
    let expandButton = "button expandButton";
    if (!this.state.sideBarExpanded)
    {
      sideBarClass += " collapsed";
      expandButton += " collapsedButton";
    }
    return (
      <div className="wholeApp">
        <div className={sideBarClass}>
          <h3 className="barItem">Menu</h3>
          {buttons.map(bt => bt)}
        </div>
        <div className="appbody">
        <a className={expandButton} onClick={((event: any) => this.toggleCollapse())}>
            {this.state.sideBarExpanded ? <FaAngleLeft/>:<FaAngleRight/>}
        </a>
        {el}
        </div>
      </div>
    );
  }
}

export default App;
