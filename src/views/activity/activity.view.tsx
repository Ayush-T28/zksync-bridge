import { useState, FC, useEffect, useCallback } from "react";

import InfiniteScroll from "src/views/activity/components/infinite-scroll/infinite-scroll.view";
import BridgeCard from "src/views/activity/components/bridge-card/bridge-card.view";
import useActivityStyles from "src/views/activity/activity.styles";
import Typography from "src/views/shared/typography/typography.view";
import Header from "src/views/shared/header/header.view";
import PageLoader from "src/views/shared/page-loader/page-loader.view";
import { useBridgeContext } from "src/contexts/bridge.context";
import { useProvidersContext } from "src/contexts/providers.context";
import { useEnvContext } from "src/contexts/env.context";
import { useErrorContext } from "src/contexts/error.context";
import { parseError } from "src/adapters/error";
import { AsyncTask, isMetamaskUserRejectedRequestError } from "src/utils/types";
import { AUTO_REFRESH_RATE, PAGE_SIZE } from "src/constants";
import { Bridge } from "src/domain";
import useCallIfMounted from "src/hooks/use-call-if-mounted";

const Activity: FC = () => {
  const callIfMounted = useCallIfMounted();
  const env = useEnvContext();
  const { fetchBridges, claim } = useBridgeContext();
  const { account, connectedProvider } = useProvidersContext();
  const { notifyError } = useErrorContext();
  const [bridgeList, setBridgeList] = useState<AsyncTask<Bridge[], undefined>>({
    status: "pending",
  });
  const [displayAll, setDisplayAll] = useState(true);
  const [endReached, setEndReached] = useState(false);
  const [wrongNetworkBridges, setWrongNetworkBridges] = useState<Bridge["id"][]>([]);
  const classes = useActivityStyles({ displayAll });

  const onDisplayAll = () => setDisplayAll(true);
  const onDisplayPending = () => setDisplayAll(false);

  const onClaim = (bridge: Bridge) => {
    if (bridge.status === "on-hold") {
      const { deposit, merkleProof } = bridge;
      claim({
        deposit,
        merkleProof,
      }).catch((error) => {
        if (isMetamaskUserRejectedRequestError(error) === false) {
          void parseError(error).then((parsed) => {
            if (parsed === "wrong-network") {
              callIfMounted(() => {
                setWrongNetworkBridges([...wrongNetworkBridges, bridge.id]);
              });
            } else {
              callIfMounted(() => {
                notifyError(error);
              });
            }
          });
        }
      });
    }
  };

  const onLoadNextPage = () => {
    if (
      env &&
      account.status === "successful" &&
      bridgeList.status === "successful" &&
      endReached === false
    ) {
      setBridgeList({ status: "reloading", data: bridgeList.data });
      fetchBridges({
        type: "load",
        env,
        ethereumAddress: account.data,
        limit: PAGE_SIZE,
        offset: bridgeList.data.length,
      })
        .then((bridges) => {
          callIfMounted(() => {
            processFetchBridgesSuccess([...bridgeList.data, ...bridges]);
            setEndReached(bridges.length < PAGE_SIZE);
          });
        })
        .catch(processFetchBridgesError);
    }
  };

  const processFetchBridgesSuccess = useCallback(
    (bridges: Bridge[]) => {
      callIfMounted(() => {
        setBridgeList({ status: "successful", data: bridges });
      });
    },
    [callIfMounted]
  );

  const processFetchBridgesError = useCallback(
    (error: unknown) => {
      callIfMounted(() => {
        setBridgeList({
          status: "failed",
          error: undefined,
        });
        notifyError(error);
      });
    },
    [callIfMounted, notifyError]
  );

  useEffect(() => {
    if (env && account.status === "successful") {
      const loadBridges = () => {
        fetchBridges({
          type: "load",
          env,
          ethereumAddress: account.data,
          limit: PAGE_SIZE,
          offset: 0,
        })
          .then(processFetchBridgesSuccess)
          .catch(processFetchBridgesError);
      };
      loadBridges();
    }
  }, [account, env, fetchBridges, processFetchBridgesError, processFetchBridgesSuccess]);

  useEffect(() => {
    if (env && account.status === "successful" && bridgeList.status === "successful") {
      const refreshBridges = () => {
        setBridgeList({ status: "reloading", data: bridgeList.data });
        fetchBridges({
          type: "reload",
          env,
          ethereumAddress: account.data,
          bridges: bridgeList.data,
        })
          .then(processFetchBridgesSuccess)
          .catch(processFetchBridgesError);
      };
      const intervalId = setInterval(refreshBridges, AUTO_REFRESH_RATE);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    account,
    bridgeList,
    env,
    fetchBridges,
    processFetchBridgesError,
    processFetchBridgesSuccess,
  ]);

  useEffect(() => {
    setWrongNetworkBridges([]);
  }, [connectedProvider?.chainId]);

  const EmptyMessage = () => <div className={classes.emptyMessage}>No Bridges found</div>;

  return (() => {
    switch (bridgeList.status) {
      case "pending":
      case "loading": {
        return (
          <>
            <Header title="Activity" backTo="home" />
            <PageLoader />
          </>
        );
      }
      case "failed": {
        return (
          <>
            <Header title="Activity" backTo="home" />
            <EmptyMessage />
          </>
        );
      }
      case "successful":
      case "reloading": {
        const pendingBridges = bridgeList.data.filter((bridge) => bridge.status !== "completed");
        const filteredList = displayAll ? bridgeList.data : pendingBridges;
        return (
          <>
            <Header title="Activity" backTo="home" />
            <div className={classes.selectorBoxes}>
              <div className={`${classes.selectorBox} ${classes.allBox}`} onClick={onDisplayAll}>
                <Typography type="body1" className={classes.status}>
                  All
                </Typography>
                <Typography type="body2" className={classes.numberAllBox}>
                  {bridgeList.data.length}
                </Typography>
              </div>
              <div
                className={`${classes.selectorBox} ${classes.pendingBox}`}
                onClick={onDisplayPending}
              >
                <Typography type="body1" className={classes.status}>
                  Pending
                </Typography>
                <Typography type="body2" className={classes.numberPendingBox}>
                  {pendingBridges.length}
                </Typography>
              </div>
            </div>
            {filteredList.length ? (
              <InfiniteScroll
                asyncTaskStatus={bridgeList.status}
                endReached={endReached}
                onLoadNextPage={onLoadNextPage}
              >
                {filteredList.map((bridge) => (
                  <BridgeCard
                    bridge={bridge}
                    onClaim={() => onClaim(bridge)}
                    networkError={wrongNetworkBridges.includes(bridge.id)}
                    key={bridge.id}
                  />
                ))}
              </InfiniteScroll>
            ) : (
              <EmptyMessage />
            )}
          </>
        );
      }
    }
  })();
};

export default Activity;
