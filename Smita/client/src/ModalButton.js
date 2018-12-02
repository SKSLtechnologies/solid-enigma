import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

function getModalStyle() {
  const top = 25;
  const left = 25;

  return {
    top: `${top}%`,
    margin:'auto'
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    width: theme.spacing.unit * 70,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[6],
    padding: theme.spacing.unit * 4,
  },
  fab: {
  },

});

class SimpleModal extends React.Component {
  state = {
    open: false,
    checked: false,
  };

  handleOpen = () => {
    this.setState({
      open: true,
      checked: !this.state.checked
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { checked } = this.state;

    return (
      <div>
        <Typography gutterBottom>Click to get the full Modal experience!</Typography>
        <Button onClick={this.handleOpen}><Fab color="primary" aria-label="Add" className={classes.fab}>
        <AddIcon />
      </Fab></Button>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.handleClose}
            style={{alignItems:'center',justifyContent:'center'}}
          >
            <Slide direction="up" in={this.state.open} mountOnEnter unmountOnExit>
            <div style={getModalStyle()} className={classes.paper}>
              <Typography variant="title" id="modal-title">
                Text in a modal
              </Typography>
              <Typography variant="subheading" id="simple-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
              <SimpleModalWrapped />
            </div>
            </Slide>
          </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
