import { Route, Switch } from "wouter";

export const Teams = () => {
  return <div>Teams
    <Switch>
      <Route path="/teams/:id" component={() => <>
        <h1>Team</h1>
      </>} />
    </Switch>
  </div>;
};
