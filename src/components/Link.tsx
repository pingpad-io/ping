import NextLink from 'next/link'

export  default function Link(props) {
  return <NextLink {...props} prefetch={props.prefetch ?? false}/>
}