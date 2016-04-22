var Finished = props => (
  <div className="finished">
    <h1>The test is finished!</h1>
  </div>
);

var Answer = props => (
  <div
    onClick={props.onClick}
    className={"answer-block " + (props.selected ? "answer-block-selected" : "")}
    id={"answer-" + props.letter}>
    <span className={"letter " + (props.selected ? "letter-selected" : "")}>{props.letter}</span>
    <span className="answer"> {props.answer}</span>
  </div>
);

var StudentApp = React.createClass({
  getInitialState: function() {
    return {
      finished: false,
      questionNum: 0,
      currentTime: this.props.route.timeLimit,
      questions: [{question: "Loading...", answers: ["*", "*", "*", "*"]}]
    };
  },

  transformData: function(input) {
    var output = [];
    input.forEach(element => {
      var x = {};
      x.question = element.name;
      x.answers = element.Answers.map(y => y.name);
      output.push(x);
    });

    return output;
  },

  loadFromServer: function() {
    $.ajax({
      url: "/questions/question_set/" + this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({questions: this.transformData(data)});
      }.bind(this),
      error: (xhr, status, err) => {
        console.log(err);
      }
    });
  },

  componentWillMount: function() {
    this.loadFromServer();
  },

  componentDidMount: function() {
    setInterval(() => {
      if(this.state.currentTime == 0) {
        // If the time's up, submit the answer and advance to the next question.
        if(this.state.questionNum+1 < this.state.questions.length) {
          this.setState({ currentTime: this.props.route.timeLimit});
          this.setState({ questionNum: this.state.questionNum+1});
        } else {
          // Hack to get the last question to correctly send.
          this.setState({ currentTime: 0 });
          this.setState({ finished: true });
        }
      } else {
        this.setState({ currentTime: this.state.currentTime-1 });
      }

    }, 1000);
  },

  sendAnswer: function(selectedAnswer) {
    $.ajax({
      url: "/api/teacher/" + this.props.params.id,
      dataType: 'json',
      type: 'POST',
      data: { questionNum: this.state.questionNum, answer: selectedAnswer },
      error: (xhr, status, err) => {
        console.log(err);
      }
    });
  },

  render: function() {
    if(!this.state.finished) {
      return (
        <div className="container">
          <div className="timer">{this.state.currentTime}</div>
          <QuestionBlock
            respond={this.sendAnswer}
            currentTime={this.state.currentTime}
            question={this.state.questions[this.state.questionNum].question}
            answers={this.state.questions[this.state.questionNum].answers}
          />
        </div>
      );
    } else {
      return (
        <Finished/>
      );
    }
  },
});

var QuestionBlock = React.createClass({
  getInitialState: function() {
    return {question: "", answers: ["?","?","?","?"], selectedAnswer: "X"}
  },

  unselect: function() {
    this.setState({ selectedAnswer: "X" });
  },

  componentWillReceiveProps: function() {
    if(this.props.currentTime == 0) {
      this.props.respond(this.state.selectedAnswer);
      this.unselect();
    }
  },

  render: function() {
    return (
      <div className="container">
        <div className="question-block">
          <h1 className="question-header">{this.props.question}</h1>
        </div>
        <div className="answers">
          <div className="row">
            <Answer
              onClick={this.click("A").bind(this)}
              selected={this.state.selectedAnswer == "A"}
              letter="A"
              answer={this.props.answers[0]}/>
            <Answer
              onClick={this.click("B").bind(this)}
              selected={this.state.selectedAnswer == "B"}
              letter="B"
              answer={this.props.answers[1]}/>
          </div>
          <div className="row">
            <Answer
              onClick={this.click("C").bind(this)}
              selected={this.state.selectedAnswer == "C"}
              letter="C"
              answer={this.props.answers[2]}/>
            <Answer
              onClick={this.click("D").bind(this)}
              selected={this.state.selectedAnswer == "D"}
              letter="D"
              answer={this.props.answers[3]}/>
          </div>
        </div>
      </div>
    );
  },

  click: function(letter) {
    return function() {
      this.setState({ selectedAnswer: letter });
    };
  }
});

ReactDOM.render(
  <ReactRouter.Router history={ReactRouter.browserHistory}>
    <ReactRouter.Route path="/student/:id" timeLimit={15} component={StudentApp}/>
  </ReactRouter.Router>,
  document.getElementById('content')
);
