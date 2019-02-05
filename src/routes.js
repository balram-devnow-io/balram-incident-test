import React from 'react'
import { Route, Switch } from 'react-router'
import Login from './modules/auth/components/Login'

const routes = (
  <div>
    <Switch>
      <Route exact path="/" />
      <Route path="/login" component={Login} />
    </Switch>
  </div>
)

export default routes
