import '../mobileStyles.css';

function Mobile(props) { 
    
    return (
        <div className='mobile' style={{border:"2px solid green"}}>
            
            <img id="main-home-logo-mobile"src={ require("../pics/cg-logo-1.png")} alt="CaveGlass"/>
            <div class="mobile-message" >To experience the full funtionality of CaveGlass, please visit us on a laptop or desktop!</div>  
            <div id="home-footer" style={{marginTop:"auto", marginBottom:"0px"}}>
                <hr class="footer-line"/>
                    <img id="footer-main-logo-mobile" src={ require("../pics/cg-logo-small.png")} alt="CaveGlass"/>
                    <p id="footer-tag"> created by Shane T.</p>
                </div>
        </div>
  );
}

export default Mobile;