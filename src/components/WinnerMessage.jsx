import TextField from "./Input/TextField";
import {useAtom} from "jotai";
import {winnerMessageState} from "../shared/globalState";

const WinnerMessage = () => {
  const [winnerMessage, setWinnerMessage] = useAtom(winnerMessageState);

  return (
    <form>
      <TextField
        id='winnerMessage'
        label='中奖提示语'
        placeholder='例如：🎉 恭喜，中奖者是...'
        value={winnerMessage}
        onChange={(e) => setWinnerMessage(e)}
        onClear={() => setWinnerMessage([])}
      />
    </form>
  );
};

export default WinnerMessage;
