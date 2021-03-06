import React, { useState } from "react";
import {
  makeStyles,
  /* Typography, Box , */ Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Box
} from "@material-ui/core";
import NoPollsImg from "../../../Assets/illustrations/polls.svg";
import { CreatePollDialog } from "./CreatePollDialog";
import PollsContext from "../../../Contexts/PollsContext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  POLLS_NAMESPACES,
  POLLS_STATES
} from "../../../Modules/pollsOperations";
import PollForm from "./PollForm";
import PollResults from "./PollResults";
import {
  getEventSessionDetails,
  isEventOwner as isEventOwnerSelector
} from "../../../Redux/eventSession";
import { useSelector, shallowEqual } from "react-redux";

const useStyles = makeStyles((theme) => ({
  emptyPane: {
    marginTop: theme.spacing(4),
    textAlign: "center"
  },
  emptyImage: {
    width: "55%",
    marginBottom: theme.spacing(1)
  },
  centerButton: {
    width: "100%",
    textAlign: "center"
  }
}));

const PollsPane = () => {
  const classes = useStyles();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const eventSessionDetails = useSelector(getEventSessionDetails, shallowEqual);
  const isEventOwner = useSelector(isEventOwnerSelector);

  const isPollCreationAllowed = React.useMemo(
    () =>
      isEventOwner ||
      (eventSessionDetails && eventSessionDetails.allowPollCreation === true),
    [eventSessionDetails, isEventOwner]
  );

  const { polls, myVotes } = React.useContext(PollsContext);

  // const hasDraft = useMemo(() => {
  //   isEventOwner && _.findIndex(polls, (p) => p.state === POLLS_STATES.DRAFT);
  // }, [isEventOwner, polls]);

  return (
    <div>
      <CreatePollDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />
      {polls[POLLS_NAMESPACES.GLOBAL].length === 0 && (
        <Box className={classes.emptyPane}>
          <img
            className={classes.emptyImage}
            src={NoPollsImg}
            alt="Polls coming soon"
          />
          {isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              There are no polls available yet.
              <br />
              Create a poll and start gathering feedback...
            </Typography>
          )}
          {!isPollCreationAllowed && (
            <Typography variant="body2" color="textSecondary" display="block">
              The organizer hasn't created any poll yet. <br />
              Check again later.
            </Typography>
          )}
        </Box>
      )}
      {polls[POLLS_NAMESPACES.GLOBAL].map((poll) => {
        if (poll.state === POLLS_STATES.PUBLISHED) {
          return (
            <ExpansionPanel key={poll.id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {poll.title}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ paddingTop: 0 }}>
                {(!myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] ||
                  myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted !== true) && (
                  <PollForm poll={poll} />
                )}
                {myVotes[POLLS_NAMESPACES.GLOBAL][poll.id] &&
                  myVotes[POLLS_NAMESPACES.GLOBAL][poll.id].voted === true && (
                    <PollResults poll={poll} />
                  )}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }
        return null;
      })}
      {isPollCreationAllowed && (
        <Box textAlign="center" mt={2} mb={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.roomButton}
            onClick={() => setCreateDialogOpen(true)}
            // disabled={participantsAvailable.length <= 1}
          >
            Create poll
          </Button>
        </Box>
      )}
    </div>
  );
};

export default PollsPane;
