import React from 'react'
import copy from 'clipboard-copy'
import { Overlay, Tooltip } from 'react-bootstrap'

class CopyToClipboard extends React.Component {
  constructor(props) {
    super(props)

    this.myRef = React.createRef()
    this.state = { showTooltip: false }
  }

  render() {
    return (
      <>
        <a
          href="#copyClipboard"
          ref={this.myRef}
          onClick={this.onCopy}
          className="text-success font-weight-bold"
        >
          {this.props.children}
        </a>
        <Overlay
          target={this.myRef.current}
          show={this.state.showTooltip}
          placement="right"
        >
          <Tooltip>Copied!</Tooltip>
        </Overlay>
      </>
    )
  }

  startTimer = () => {
    const timerId = setTimeout(
      () => this.setState({ showTooltip: false }),
      1500,
    )
    this.setState({ timerId })
  }

  onCopy = e => {
    e.preventDefault()
    copy(this.props.children)
    this.setState({ showTooltip: true })
    this.startTimer()
  }

  handleOnTooltipClose = () => {
    this.setState({ showTooltip: false })
  }

  componentWillUnmount() {
    clearTimeout(this.state.timerId)
  }
}

export default CopyToClipboard
