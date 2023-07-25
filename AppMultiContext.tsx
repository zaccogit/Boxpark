import React from 'react'

const nest = (
  children: React.ReactNode,
  component: React.ReactElement
) => React.cloneElement(component, {}, children)

export type MultiProviderProps = React.PropsWithChildren<{
  providers: React.ReactElement[]
}>

const AppMultiContext: React.FC<MultiProviderProps> = ({
  children,
  providers
}) => (
  <React.Fragment>
    {providers.reduceRight(nest, children)}
  </React.Fragment>
)

export default AppMultiContext