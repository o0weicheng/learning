import { Button, ButtonGroup } from "./components/common/button";

function App() {
  const handleClick = (e, i) => {
    console.log(e, i);
  };
  return (
    <section className="my-4">
      <ButtonGroup onClick={handleClick}>
        <Button>click me</Button>
        <Button>click me</Button>
        <Button>click me</Button>
        <Button>click me</Button>
      </ButtonGroup>
    </section>
  );
}

export default App;
