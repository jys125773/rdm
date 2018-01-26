import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ACTIONS } from '../rdm';

class Counter extends React.Component {
  render() {
    const { dispatch, actions: { _decrementAsync, decrementAsync, increment } } = this.props;

    return (
      <div>
        <h4>combinedFooBar/counter</h4>
        <div>
          <button onClick={() => _decrementAsync()}>_latest</button>
          <button onClick={() => decrementAsync()}>every</button>
          <span>{this.props.value}</span>
          <button onClick={() => increment(1, { debounce: { time: 300 } })}>+</button>
          <button onClick={() => dispatch({
            type: '@@redux/BATCH_ACTIONS', payload: [
              this.props.increment(1),
              this.props.increment(1),
              this.props.increment(1),
              this.props.increment(1),
            ]
          })}>++++</button>
        </div>
        <div>
          <button onClick={() => dispatch({ type: 'reset_combinedFooBar' })}>reset combinedFooBar</button>
          <br />
          <button onClick={() => dispatch({ type: 'reset_combinedFooBar/counter' })}>reset combinedFooBar.counter</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state.combinedFooBar.counter;
};

const mapDispatchToProps = (dispatch) => {
  const { combinedFooBar: { counter, counter: { increment } } } = ACTIONS;

  return {
    increment,
    dispatch,
    actions: bindActionCreators(counter, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);