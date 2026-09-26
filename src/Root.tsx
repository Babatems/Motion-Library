import "./index.css";
import { Composition, Folder } from "remotion";
import {
  HelloMotion,
  helloMotionSchema,
} from "./compositions/HelloMotion/HelloMotion";
import { LullLaunch } from "./compositions/LullLaunch/LullLaunch";
import { OwomiLaunch } from "./compositions/OwomiLaunch/OwomiLaunch";
import { END as OWOMI_END, FPS as OWOMI_FPS, sec as owomiSec } from "./compositions/OwomiLaunch/timeline";
import { CTA } from "./compositions/LullLaunch/scenes/CTA";
import { Intro } from "./compositions/LullLaunch/scenes/Intro";
import { Problem } from "./compositions/LullLaunch/scenes/Problem";
import { Solution } from "./compositions/LullLaunch/scenes/Solution";
import { SCENES, TOTAL_FRAMES } from "./compositions/LullLaunch/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OwomiLaunch"
        component={OwomiLaunch}
        durationInFrames={owomiSec(OWOMI_END)}
        fps={OWOMI_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="LullLaunch"
        component={LullLaunch}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="LullLaunch-Scenes">
        <Composition id="Lull-Intro" component={Intro} durationInFrames={SCENES.intro} fps={30} width={1920} height={1080} />
        <Composition id="Lull-Problem" component={Problem} durationInFrames={SCENES.problem} fps={30} width={1920} height={1080} />
        <Composition id="Lull-Solution" component={Solution} durationInFrames={SCENES.solution} fps={30} width={1920} height={1080} />
        <Composition id="Lull-CTA" component={CTA} durationInFrames={SCENES.cta} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition
        id="HelloMotion"
        component={HelloMotion}
        schema={helloMotionSchema}
        durationInFrames={130}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Hello, Motion",
          subtitle: "Remotion is ready to go",
          accent: "#7c5cff",
        }}
      />
    </>
  );
};
