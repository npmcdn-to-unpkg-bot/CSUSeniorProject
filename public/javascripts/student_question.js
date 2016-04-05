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
      timelimit: 15,
      questions: [{question: "Loading...", answers: ["*", "*", "*", "*"]}]
    };
  },

  loadFromServer: function() {
    $.ajax({
      url: "/api/student/" + this.props.id,
      dataType: 'json',
      type: 'GET',
      success: data => {
        this.setState({questions: data});
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
    /* setInterval(() => {
      if(this.state.questionNum+1 < this.state.questions.length) {
        this.setState({ questionNum: this.state.questionNum+1});
      } else {
        this.setState({ finished: true });
      }
    }, this.state.timelimit*1000);
    */  },

  render: function() {
    if(!this.state.finished) {
      return (
        <QuestionBlock
          question={this.state.questions[this.state.questionNum].question}
          answers={this.state.questions[this.state.questionNum].answers}
        />
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
  <StudentApp id={2} />,
  document.getElementById('content')
);
