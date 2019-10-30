import React from 'react'
import { RequestContext } from '@botonic/react'
import DayPicker from 'react-day-picker'
import { Button, Heading } from 'evergreen-ui'
import 'react-day-picker/lib/style.css'
import '../styles.scss'

class DatePicker extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      enteredTo: null // Keep track of the last day for mouseEnter.
    }
  }
  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
    const isRangeSelected = from && to
    return !from || isBeforeFirstDay || isRangeSelected
  }
  handleDayClick(day) {
    const { from, to } = this.state
    if (from && to && day >= from && day <= to) {
      this.handleResetClick()
      return
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null
      })
    } else {
      this.setState({
        to: day,
        enteredTo: day
      })
    }
  }
  handleDayMouseEnter(day) {
    const { from, to } = this.state
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day
      })
    }
  }
  handleResetClick() {
    this.setState(this.getInitialState())
  }
  close() {
    this.context.closeWebview({
      params: this.props.context,
      payload: `DATES_SELECTED-${this.state.from.toLocaleDateString()}--${this.state.to.toLocaleDateString()}`
    })
  }

  render() {
    const { from, to, enteredTo } = this.state
    const modifiers = { start: from, end: enteredTo }
    const disabledDays = { before: this.state.from }
    const selectedDays = [from, { from, to: enteredTo }]
    return (
      <div className='date-picker'>
        <Heading size={600}>Please, select the dates:</Heading>
        <div>
          <DayPicker
            className='Range'
            numberOfMonths={1}
            fromMonth={from}
            selectedDays={selectedDays}
            disabledDays={disabledDays}
            modifiers={modifiers}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
          />
          <div>
            {!from && !to && 'Please select the first day.'}
            {from && !to && 'Please select the last day.'}
            {from &&
              to &&
              `Selected from ${from.toLocaleDateString()} to
                    ${to.toLocaleDateString()}`}
          </div>
        </div>
        <br />
        <Button appearance='primary' height={48} onClick={() => this.close()}>
          Confirm
        </Button>
        <br />
        {from && to && (
          <Button
            appearance='minimal'
            intent='warning'
            onClick={this.handleResetClick}
          >
            Reset
          </Button>
        )}
      </div>
    )
  }
}

export default DatePicker
