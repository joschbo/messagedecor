import { Card, Flex } from "antd";
import MessageDecorator from "./components/MessageDecorator";
import { Description } from "./components/Description";

const App = () => (
  <div className="App">
    <Flex justify="center" vertical style={{ height: "95vh" }}>
      <Flex justify="center">
        <Card title="MessageDecor👨‍🎨" style={{ width: "80vw", height: "90vh", overflow: "hidden"}} styles={{ body: { height: "70%", paddingTop: "10px"} }}>
          <Description />
          <MessageDecorator />
        </Card>
      </Flex>
    </Flex>
  </div>
);

export default App;