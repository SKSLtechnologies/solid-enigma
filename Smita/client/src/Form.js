import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
// import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  container: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    display: 'flex',
    border: 0,
    borderRadius: 3,
    padding: '30px',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 800,
  },
});

class Form extends React.Component {
  state = {
    text: ""
  };

  handleChange = e => {
    const newText = e.target.value;
    this.setState({
      text: newText
    });
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.props.submit(this.state.text);
      this.setState({ text: "" });
    }
  };

  render() {
    const { text } = this.state;
    const { classes } = this.props;
    return (
      <form className={classes.container} >
      <TextField
        id="standard-with-placeholder"
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        label="Click me!"
        placeholder="Enter Todo"
        margin="normal"
        value={text}
        fullWidth
      />
      </form>
    );
  }
}



export default withStyles(styles)(Form);