import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import withStyles from '@material-ui/core/styles/withStyles';
import formHelper from '../../../utils/formHelper';
import authService from '../service';
import _ from 'lodash';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submit = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.submit) {
      return;
    }

    const error = nextProps.error;
    if (nextProps.loading) {
      return;
    }

    // on succeess, redirect to 'home' page
    if (Object.keys(error).length === 0) {
      // nextProps.dispatch(pushPath('/dashboard'));
    } else {
      this.handleSubmitError(error);
    }
  }

  handleSubmitError(error) {
    const { statusCode, errors } = error;
    if (statusCode === 400 && errors) {
      _.assign(this.state, { errors: errors });
      this.error = {};
    } if (statusCode === 400 && !errors) {
      this.error = error;
    } else {
      this.error = error;
    }
  }

  handleChange(name, value, parentKey = null) {
    const newState = {};
    if (parentKey) {
      newState[name] = {};
      newState[name][parentKey] = value;
    } else {
      newState[name] = value;
    }
    this.setState(newState);
    delete this.state.errors[name];
  }

  handleSubmit(e) {
    this.submit = true;
    e.preventDefault();
    const params = formHelper().setParams(this.state);
    const { dispatch } = this.props;
    authService(dispatch).login(params);
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Icon>star</Icon>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            { errors.email ? (
              <FormControl margin="normal" required fullWidth error>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                 id="login-email"
                 name="email"
                 type="email"
                 autoComplete="email"
                 onChange={event => this.handleChange('email', event.target.value)}
                 value={this.state.email}/>
                 {errors.email &&
                    <FormHelperText id="email-error-text">{errors.email}</FormHelperText>
                  }
                </FormControl>) : (
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                   id="email-password"
                   name="email"
                   type="email"
                   autoComplete="email"
                   onChange={event => this.handleChange('email', event.target.value)}
                   value={this.state.email}/>
                </FormControl>)
              }
            { errors.loginId ? (
              <FormControl margin="normal" required fullWidth error>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                 id="login-password"
                 name="password"
                 type="password"
                 autoComplete="current-password"
                 onChange={event => this.handleChange('password', event.target.value)}
                 value={this.state.password}/>
                 {errors.loginId &&
                    <FormHelperText id="password-error-text">{errors.loginId}</FormHelperText>
                  }
                </FormControl>) : (
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                   id="login-password"
                   name="password"
                   type="password"
                   autoComplete="current-password"
                   onChange={event => this.handleChange('password', event.target.value)}
                   value={this.state.password}/>
                </FormControl>)
              }

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={this.props.loading}
              onClick={this.handleSubmit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
 }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const select = state => {
  return {
    error: state.auth.get('error'),
    loading: state.auth.get('loading')
  };
};

Login = withStyles(styles)(Login);

export default connect(select)(Login);