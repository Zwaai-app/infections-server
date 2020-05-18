import React from 'react'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'
import { Space } from '../Spaces/spacesSlice'
import { pipe } from 'fp-ts/lib/pipeable'

export const Preview = (props: Props) => {
    const spaces = useSelector((state: RootState) => state.spaces.spaces)

    return <div id='spacePreview'>
        {pipe(
            O.fromNullable(props.match.params.id),
            O.chain(id => R.lookup(id, spaces)),
            O.fold(SpaceNotFound, ShowPreview))}
    </div>
}

const SpaceNotFound = () => {
    return <div>not found</div>
}

const ShowPreview = (space: Space) => {
    return <>
        <h1>{space.name}</h1>
        <p>{space.description}</p>
    </>
}

interface Props {
    match: {
        params: {
            id: string
        }
    }
}
