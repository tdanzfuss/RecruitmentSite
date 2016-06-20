var CommentBox = React.createClass({
  getInitialState: function() {
      return {data: [], url:"/api/jobs"};
    },
    componentDidMount: function() {
        $.ajax({
          url: this.state.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            alert ('Error'+this.state.url);
            console.error(this.state.url, status, err.toString());
          }.bind(this)
        });
      },
  render: function() {
    var visibleJobNodes = this.state.data;
    var viewDetail = false;

    if (this.props.params && this.props.params.id)
    {
      var idParam = this.props.params.id;

      visibleJobNodes = this.state.data.filter(function(j){
        return idParam == j.id;
      });
    }

    return (
      <div>
        <div className="center-block seperator">Available Positions</div>
        <CommentList data={visibleJobNodes} />
      </div>
    );
  }
});

// tutorial5.js
var CommentList = React.createClass({
  render: function() {
    var jobNodes = this.props.data.map(function(job) {
    // var jobNodes = this.props.data.map(function(job) {
      return (
        <JobDescription name={job.name} id={job.id} key={job.id} summary={job.summary} brief={job.brief} requirements={job.requirements} responsibilities={job.responsibilities} >

        </JobDescription>
      );
    });

    return (
      <div className="row">
        {jobNodes}
      </div>
    );
  }
});

var JobDescription = React.createClass({

  getInitialState: function() {
      return {
        viewDetail: false
      };
    },

  toggleViewDetailState: function(e) {
      this.setState({viewDetail: !this.state.viewDetail});
      // alert(JSON.stringify(this.props,null,2));
      // location.hash = "#" + this.props.id;
    },

  rawMarkup: function(txt) {
    var md = new Remarkable();
    var rawMarkup = md.render(txt);
    return { __html: rawMarkup };
  },

  renderSummary: function()
  {
    return (
      <div className="comment col-md-4">
        <img src="/img/user.png" className="avatar"/>
        <h2 className="commentAuthor">
          {this.props.name}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup(this.props.summary)} />
        <p><ReactRouter.Link className="btn btn-default" to={'/jobdescription/'+this.props.id} onClick={this.toggleViewDetailState}>View details &raquo;</ReactRouter.Link></p>
      </div>
    );
  },
  renderDetail: function()
  {
    var i = 0;
    var reqList = this.props.requirements.map(function(req){
      return (
        <li key={i++}>{req}</li>
      );
    });

    var respList = this.props.responsibilities.map(function(resp){
      return (
        <li key={i++}>{resp}</li>
      );
    });

    return (
      <div className="comment col-md-12">
        <img src="/img/user.png" className="avatar"/>
        <h2 className="commentAuthor">
          {this.props.name}
        </h2>
        <a name={this.props.id} />
        <p>
          <span dangerouslySetInnerHTML={this.rawMarkup(this.props.brief)} />
        </p>
        <div className="row text-left">
          <div className="col-md-6">
            <h4 className="text-uppercase">Requirements</h4>
            <ul>
              {reqList}
            </ul>
          </div>
          <div className="col-md-6">
            <h4 className="text-uppercase">Responsibilities</h4>
            <ul>
              {respList}
            </ul>
          </div>
        </div>

        <p className="text-right">
          <ReactRouter.Link className="btn btn-danger" to="/" onClick={this.toggleViewDetailState}>Back</ReactRouter.Link>
          <ReactRouter.Link className="btn btn-success" to="/apply" onClick={this.toggleViewDetailState}>Apply Now!</ReactRouter.Link>
        </p>
      </div>
    );
  },

  render: function() {
    //if (this.props.viewDetail)
    //  this.setState({viewDetail: this.props.viewDetail});

    if (this.state.viewDetail == true)
      return this.renderDetail()
    else
      return this.renderSummary();
  }
});

var AboutUs = React.createClass({
  render: function(){
    return(
      <h2>About Us</h2>
    );
  }
});

var TheProcess = React.createClass({
  render: function(){
    return(
      <h2>The Process</h2>
    );
  }
});

var ThankYou = React.createClass({
  render: function(){
      return(
        <div>
          <h2>Thank you for submitting your details</h2>
          <p>A representative from the firm will be in contact shortly. We know you are anxious to get started, check out the rest of the process below.</p>
          <TheProcess />
        </div>
      );
  }
});

var ApplicationForm = React.createClass({
  //var initState =

  getInitialState: function(){
    return {name:'',email:'',phone:'',surname:'',region:''};
  },
  handleFormSubmit: function(appForm)
  {
    $.ajax({
     url: '/api/application',
     dataType: 'json',
     type: 'POST',
     data: appForm,
     success: function(data) {
       window.location = '/#/thankyou';
       // alert ('Data Submitted to server');
       // this.setState({data: data});
     }.bind(this),
     error: function(xhr, status, err) {
       console.error('api/application', status, err.toString());
     }.bind(this)
   });
  },
  handleNameChange: function(e)
  {
    this.setState({name:e.target.value});
  },
  handleEmailChange: function(e)
  {
    this.setState({email:e.target.value});
  },
  handlePhoneChange: function(e)
  {
    this.setState({phone:e.target.value});
  },
  handleSurnameChange: function(e)
  {
    this.setState({surname:e.target.value});
  },
  handleRegionChange: function(e)
  {
    this.setState({region:e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.handleFormSubmit(this.state);
    this.setState({name:'',email:'',phone:'',surname:'',region:''});
  },
  render: function(){
    return (
      <div>
      <h2>Tell us about yourself</h2>
      <div className="row">
        <form className="applicationForm" onSubmit={this.handleSubmit} >
        <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <input
              className="form-control"
              type="text"
              placeholder="Email Address"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
            <input
              className="form-control"
              type="text"
              placeholder="Phone number"
              value={this.state.phone}
              onChange={this.handlePhoneChange}
            />

            </div>
            <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Surname"
                  value={this.state.surname}
                  onChange={this.handleSurnameChange}
                />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Region"
                  value={this.state.region}
                  onChange={this.handleRegionChange}
                />

                <p className="text-right">
                  <input type="submit" value="Apply Now!" className="btn btn-success"/>
                </p>
              </div>
        </form>
      </div>
      </div>)
  }
});
/*
<Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="users" component={Users}>
        <Route path="/user/:userId" component={User}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
*/
ReactDOM.render(
  <ReactRouter.Router history={ReactRouter.hashHistory}>
    <ReactRouter.Route path="/" component={CommentBox} />
    <ReactRouter.Route path="/aboutus" component={AboutUs} />
    <ReactRouter.Route path="/process" component={TheProcess} />
    <ReactRouter.Route path="/apply" component={ApplicationForm} />
    <ReactRouter.Route path="/thankyou" component={ThankYou} />
    <ReactRouter.Route path="/jobdescription/:id" component={CommentBox} />
  </ReactRouter.Router>,document.getElementById('content')
);
/*ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);*/
