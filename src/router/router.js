import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import nodeActions from 'store/actions/nodeActions';
import { Layout } from '../components/layout';
import Dashboard from '../components/pages/Dashboard';
import Wallet from '../components/pages/Wallet';

const mapDispatchToProps = (dispatch) => ({
  dispatchGetNetwork: () => dispatch(nodeActions.getNetwork()),
});

const Router = (props) => {
  const { dispatchGetNetwork } = props;

  useEffect(() => {
    dispatchGetNetwork();
  }, []);

  return (
    <BrowserRouter basename="/panel">
      <Layout>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/wallet" component={Wallet} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default connect(null, mapDispatchToProps)(memo(Router));
