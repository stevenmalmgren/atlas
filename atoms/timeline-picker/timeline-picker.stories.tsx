import * as React from 'react'
import { useState } from 'react'
import { action } from '@connexta/ace/@storybook/addon-actions'
import { select, number } from '@connexta/ace/@storybook/addon-knobs'
import { storiesOf } from '@connexta/ace/@storybook/react'
import TimelinePicker from './index'

//@ts-ignore
import moment from 'moment-timezone'

import { test_data } from './util'

const DATE_FORMAT = 'DD MMMM YYYY h:mm a'
const TIMEZONE = 'America/New_York'

const stories = storiesOf('Timeline Picker', module).addParameters({
  info: `The TimelinePicker is a controlled component that can be used to select a time range. The TimelinePicker utilizies d3.js,
  and supports zooming and dragging as well as translation between timezones.`,
})

// Hack to make hooks work with storybook. Real fix available in https://github.com/storybookjs/storybook/releases/tag/v5.2.0-beta.10
stories.addDecorator((Story: any) => <Story />)

const formatDate = (value: Date) => moment(value).format(DATE_FORMAT)

const renderValues = (value: Date[]) => {
  if (value === undefined || value.length != 2) {
    return ''
  }

  return `${formatDate(value[0])} - ${formatDate(value[1])}`
}

stories.add('Initial Range', () => {
  const [selectionRange, setSelectionRange] = useState([
    new Date('01/25/1995'),
    new Date('05/04/2008'),
  ])
  const [hover, setHover] = useState()

  const dateAttribute = select(
    'Date Attribute',
    {
      Created: 'created',
      Modified: 'modified',
    },
    'created'
  )

  const numDataPoints = number(
    'Number of yearly spaced data points to render',
    10
  )

  return (
    <div style={{ backgroundColor: '#35343a' }}>
      <TimelinePicker
        timezone={TIMEZONE}
        data={test_data(numDataPoints)}
        dateAttribute={dateAttribute}
        onChange={(v: Date[]) => {
          action('onChange')(v)
          setSelectionRange(v)
        }}
        onHover={(v: Date) => setHover(v)}
        selectionRange={selectionRange}
      />
      <div style={{ display: 'flex', color: 'white' }}>
        <div style={{ paddingRight: '100px' }}>
          <p>Start</p>
          <p>{formatDate(selectionRange[0])}</p>
        </div>
        <div>
          <p>End</p>
          <p>{formatDate(selectionRange[1])}</p>
        </div>
      </div>
    </div>
  )
})

stories.add('No Initial Range', () => {
  const [value, setValue] = useState([])
  const [hover, setHover] = useState()

  const dateAttribute = select(
    'Date Attribute',
    {
      Created: 'created',
      Modified: 'modified',
    },
    'created'
  )

  const numDataPoints = number(
    'Number of yearly spaced data points to render',
    10
  )

  return (
    <div>
      {`Values: ${renderValues(value)}`}
      <br />
      <br />
      {`Hover: ${hover != null ? formatDate(hover) : ''}`}
      <TimelinePicker
        timezone={TIMEZONE}
        data={test_data(numDataPoints)}
        dateAttribute={dateAttribute}
        onChange={(v: Date[]) => {
          action('onChange')(v)
          setValue(v as any)
        }}
        onHover={(v: Date) => setHover(v)}
        selectionRange={value}
      />
    </div>
  )
})
