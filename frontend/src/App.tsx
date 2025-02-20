import { Card, Flex } from "antd";
import MessageDecorator from "./components/MessageDecorator";
import { Description } from "./components/Description";

const App = () => (
  <div className="App">
    <Flex justify="center" vertical style={{ minHeight: "95vh" }}>
      <Flex justify="center">
        <Card title="MessageDecor👨‍🎨" style={{ width: "80vw"}} styles={{ body: { paddingTop: "10px"} }}>
          <Flex vertical>
          <Description />
          <MessageDecorator />
          </Flex>
        </Card>
      </Flex>
    </Flex>
  </div>
);

export default App;