/* @flow weak */
import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import Pane from './Pane'

class PaneAxis extends Component {
  static propTypes = {
    id: PropTypes.string,
    pane: PropTypes.object,
  };

  static childContextTypes = { onResizing: PropTypes.func };

  constructor (props) {
    super(props)
    this.resizingListeners = []
  }

  getChildContext () { return { onResizing: this.onResizing.bind(this) } }
  onResizing (listener) { if (typeof listener === 'function') { this.resizingListeners.push(listener) } }

  render () {
    const { pane } = this.props
    let Subviews
    if (pane.views.length) {
      Subviews = pane.views.map(paneId =>
        <Pane key={paneId} paneId={paneId} parentFlexDirection={pane.flexDirection} />
      )
    } else {
      Subviews = <Pane paneId={pane.id} parentFlexDirection={pane.flexDirection} />
    }

    return (
      <div id={this.props.id}
        className={cx('pane-axis', this.props.className)}
        style={{ flexDirection: pane.flexDirection, ...this.props.style }}
      >{Subviews}
      </div>
    )
  }
}

export default PaneAxis
