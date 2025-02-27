import { TablabContext } from "../layouts/TablabContextLayout";
import { Fragment, useContext } from "react";
import { Link } from "react-router";

export default function Dashboard() {
  const { tabs } = useContext(TablabContext);
  console.log(tabs);
  return (
    <div>
      {tabs.map((tab) => (
        <Fragment key={tab.details.id}>
          <Link to={`/editor/${tab.id}`}>
            <div className="db-list-item">
              <p>{tab.id}</p>
              <p>{tab.details.song}</p>
              <p>{tab.details.artist}</p>
              <p>{tab.details.tuning.toReversed()}</p>
            </div>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
