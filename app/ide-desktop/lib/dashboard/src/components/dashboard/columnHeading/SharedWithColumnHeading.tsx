/** @file A heading for the "Shared with" column. */
import * as React from 'react'

import PeopleIcon from 'enso-assets/people.svg'

import * as textProvider from '#/providers/TextProvider'

import SvgMask from '#/components/SvgMask'

/** A heading for the "Shared with" column. */
export default function SharedWithColumnHeading(): JSX.Element {
  const { getText } = textProvider.useText()
  return (
    <div className="flex items-center gap-2">
      <SvgMask src={PeopleIcon} className="h-4 w-4" />
      <span className="leading-144.5 h-6 py-0.5">{getText('sharedWithColumnName')}</span>
    </div>
  )
}
