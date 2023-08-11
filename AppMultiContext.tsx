import React, { FC, Fragment, PropsWithChildren, ReactElement, ReactNode, cloneElement } from 'react'

const nest = (
  children: ReactNode,
  component: ReactElement
) => cloneElement(component, {}, children)

export type MultiProviderProps = PropsWithChildren<{
  providers: ReactElement[]
}>

const AppMultiContext: FC<MultiProviderProps> = ({
  children,
  providers
}) => (
  <Fragment>
    {providers.reduceRight(nest, children)}
  </Fragment>
)

export default AppMultiContext