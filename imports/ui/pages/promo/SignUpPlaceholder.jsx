import React, { Component } from 'react';
import { Link } from 'react-router';

export default class SignUpPlaceholderPage extends Component {
  render() {
    return (
      <div className="sign-up-placeholder-page">
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation" style={{ backgroundColor: 'white' }}>
          <div className="navbar-header">
            <span className="navbar-brand" href="#">
              <h4 className="email-headline" style={{ fontWeight: 400, textAlign: 'center' }}>
              <span style={{
                padding: '2px 6px 2px 6px',
                backgroundColor: 'rgb(255, 255, 255',
                borderRadius: '5px',
                border: '1px solid rgb(121, 121, 121)'
              }}>
              <span className="i-logo" style={{ color: '#FE0303' }}>in</span>
                <span className="s-logo" style={{ color: '#0396F2' }}>Slim</span>
              </span>
              </h4>
        </span>
            <ul className="nav top-nav visible-xs">
              <Link className="navbar-brand pull-right" to="/login" style={{ color: '#54A1D8' }}>
                <small className="text-muted">Member Login</small>
              </Link>

            </ul>
          </div>
          <ul className="nav top-nav hidden-xs">
            <Link className="navbar-brand pull-right" to="/login" style={{ color: '#54A1D8' }}>
              <small className="text-muted">Member Login</small>
            </Link>

          </ul>

        </nav>

        <div className="carousel slide">


          <div className="carousel-inner" role="listbox">

            <div className="item active">
              <div className="container">
                <div className="headerbox">

                  <div className="row">
                    <div className="col-md-5 myMargin">
                      <h1 className="top white-font-h1">
                        <span className="hidden-md">An Online Community That Supports Your Weight Loss</span>
                        <span className="visible-md">Real Stories, Real Weight Loss..<br /> All Free</span>
                      </h1>

                      <table width="100%">
                        <tbody>
                        <tr>
                          <td>
                            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 white-background signup-form" style={{ marginTop: '30px' }}>
                              <div className="col-lg-12  col-md-12  col-sm-12 col-xs-12 text-center signUpFormInput">
                                <Link to="/register" className="btn btn-danger btn-lg countinue btn-block">Get Started</Link>
                              </div>
                              <br />
                            </div>
                          </td>
                          <td>&nbsp;</td>
                        </tr>
                        </tbody>
                      </table>

                    </div>

                    <div className="col-md-7 myPadding">
                      <div className="videotop">
                        <img src="https://s3-us-west-2.amazonaws.com/inslim/images/15-Delicious-4.jpg"
                             className="img-responsive" alt="" />
                      </div>
                    </div>

                  </div>
                </div>


              </div>
            </div>


          </div>
        </div>

        <div className="container marketing">


          <div className="row featurette">

            <div className="col-md-2" />
            <div className="col-md-8">
              <h2 className="featurette-heading">Learn Fat Burning Secrets, <br />Track Your Progress, <br /><span
                className="text-muted">And Connect With Others.</span></h2>
              <p className="lead">inSlim is a community designed to provide you with all the tools and information you
                need to lose weight.. and to connect you with others who are on the same journey as you are!</p>

            </div>
            <div className="col-md-2" />

          </div>

          <hr className="featurette-divider" />

          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading">People losing <br /> <span
                className="text-muted">hundreds of pounds.</span></h2>
              <p className="lead">No Gimmicks. No BS. No "Secret Pills". Just amazing weight loss strategies as told by
                the people who actually did it. <span className="text-muted">Featured in the image to the right is Brenda, another one of our instructors who will share her amazing transformation with you.</span>
              </p>
            </div>
            <div className="col-md-5">
              <img className="featurette-image img-responsive no-top-margin"
                   src="https://s3-us-west-2.amazonaws.com/inslim/images/canstockphoto5434510.jpg"
                   style={{ marginTop: 0 }} />
            </div>
          </div>

          <hr className="featurette-divider" />

          <div className="row featurette">
            <div className="col-md-5">


              <img className="featurette-image img-responsive"
                   src="https://s3-us-west-2.amazonaws.com/inslim/images/ls.jpg" style={{ marginTop: 0 }} />
            </div>
            <div className="col-md-7">
              <h2 className="featurette-heading">Best Of All.. <span className="text-muted">It's Free.</span></h2>
              <p className="lead">Hundreds of videos, with dozens of weight loss stories. We will teach you how to lose
                weight, ways to look at food, easy recipes.. everything you need to change your life!</p>
            </div>
          </div>

        </div>

        <div className="carousel slide " data-ride="carousel" style={{ marginTop: '20px' }}>

          <div className="carousel-inner" role="listbox">

            <div className="item active">

              <div className="container">
                <div className="headerbox">

                  <div className="row">
                    <div className="col-md-8 col-md-offset-2 myMargin">
                      <h3 className="top white-font-h1 featurette-heading" style={{ paddingTop: 0 }}>
                        <span className="hidden-md">Start Your Free Trial</span>
                        <span className="visible-md" style={{ fontSize: '40px' }}>Start Your Free Trial</span>
                      </h3>

                      <table width="100%">
                        <tbody>
                        <tr>
                          <td>
                            <p className="topb helvetica" style={{ color: 'black' }}>Start your free trial today.</p>
                            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 white-background signup-form">
                              <div className="col-lg-12  col-md-12  col-sm-12 col-xs-12 text-center signUpFormInput">
                                <Link to="/register" className="btn btn-danger btn-lg countinue btn-block">Get Started</Link>
                              </div>
                              <br />
                            </div>
                          </td>
                          <td>&nbsp;</td>
                        </tr>
                        </tbody>
                      </table>

                    </div>

                  </div>
                </div>


              </div>
            </div>


          </div>

        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

          <div className="text-center helvetica hidden-xs">
            Call: (321)<span style={{ color: '#FE0303' }}> 430-</span><span style={{ color: '#0396F2' }}>7546</span> | Email: <a href="mailto:inslim@inslim.com?subject=inSlim Question" style={{ color: '#0396F2' }}>inslim@inslim.com</a> | <Link to="/login">Member Login</Link> | <Link to="/terms">Terms And Conditions</Link>

          </div>
          <div className="text-center helvetica visible-xs">
            Call: (321)<span style={{ color: '#FE0303' }}> 430-</span><span style={{ color: '#0396F2' }}>7546</span> <br />Email: <a href="mailto:inslim@inslim.com?subject=inSlim Question" style={{ color: '#0396F2' }}>inslim@inslim.com</a>  <br /><Link to="/login" style={{ color: '#0396F2' }}>Member Login</Link> | <Link to="/terms">Terms And Conditions</Link>
          </div>
        </div>
        <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-10 col-xs-12">
          <div className="text-center text-muted helvetica" style={{ marginBottom: '20px' }}>
            <small>Weight loss results are not guaranteed.</small>
          </div>
        </div>
      </div>

    );
  }
}