import React from "react";
import classNames from "classnames";
import { splitPath, isDefined } from "Utility";
import { Snowflake, isSnowflake, Guild } from "Utility/types";
import { usePool } from "Store/slices/pools";

import Placeholder from "Components/Placeholder";
import GuildIcon from "Components/GuildIcon";
import Tooltip from "Components/Tooltip";
import Icon from "Components/Icon";

import "./style.scss";
import { useLocation } from "react-static";
import { Option, None, Some } from "Utility/option";

const PLACEHOLDER_COUNT = 5;
const ICON_WIDTH = 52;

type GuildListProps = {
  onClickGuild: (id: Snowflake) => void;
  onClickAdd: () => void;
};

const architusAdminGuildsFilter = (guild: Guild): boolean =>
  guild.has_architus && guild.architus_admin;
const otherGuildsFilter = (guild: Guild): boolean =>
  guild.has_architus && !guild.architus_admin;

const GuildList: React.FC<GuildListProps> = ({ onClickGuild, onClickAdd }) => {
  const { all: architusAdminGuilds, isLoaded: hasLoaded } = usePool("guilds", {
    filter: architusAdminGuildsFilter,
  });
  const { all: otherGuilds } = usePool("guilds", {
    filter: otherGuildsFilter,
  });
  const squareStyle = { width: `${ICON_WIDTH}px`, height: `${ICON_WIDTH}px` };

  // Parse active guild ID from location
  const location = useLocation();
  let activeGuildId: Option<Snowflake> = None;
  if (isDefined(location)) {
    const fragments = splitPath(location.pathname);
    activeGuildId = Option.from(
      fragments.length >= 2 ? fragments[1] : null
    ).flatMap((str) => {
      if (isSnowflake(str)) return Some(str);
      return None;
    });
  }

  return (
    <div className="guild-list vertical">
      {hasLoaded ? (
        <>
          {architusAdminGuilds.length > 0 ? (
            <Section
              guilds={architusAdminGuilds}
              onClickGuild={onClickGuild}
              iconStyle={squareStyle}
              activeGuildId={activeGuildId.orNull()}
              elevated
              className="guild-list--section__elevated"
            />
          ) : null}
          {otherGuilds.length > 0 ? (
            <Section
              guilds={otherGuilds}
              onClickGuild={onClickGuild}
              iconStyle={squareStyle}
              activeGuildId={activeGuildId.orNull()}
            />
          ) : null}
          <Tooltip id="add-architus-tooltip" text="Add architus to a server...">
            <AddButton style={squareStyle} onClick={onClickAdd} />
          </Tooltip>
        </>
      ) : (
        [...Array(PLACEHOLDER_COUNT)].map((_e, i) => (
          <Placeholder.Auto circle width={`${ICON_WIDTH}px`} key={i} />
        ))
      )}
    </div>
  );
};

export default GuildList;

// ? =================
// ? Helper components
// ? =================

type AddButtonProps = {
  onClick: () => void;
  className?: string;
} & Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>;

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  className,
  ...rest
}: AddButtonProps) => (
  <button
    className={classNames("guild-add-button", className)}
    onClick={onClick}
    {...rest}
  >
    <Icon name="plus" />
  </button>
);

type SectionProps = {
  guilds: Guild[];
  onClickGuild: (id: Snowflake) => void;
  activeGuildId: Snowflake | null;
  iconStyle?: object;
  elevated?: boolean;
  className?: string;
};

const Section: React.FC<SectionProps> = ({
  guilds,
  onClickGuild,
  activeGuildId,
  iconStyle,
  elevated = false,
  className,
}: SectionProps) => {
  return (
    <div className={classNames("guild-list--section", className)}>
      {guilds.map(({ icon, id, name }) => (
        <GuildIcon
          icon={icon}
          id={id}
          name={name}
          key={id}
          onClick={(): void => onClickGuild(id)}
          style={iconStyle}
          tabIndex={0}
          elevated={elevated}
          className={id === activeGuildId ? "guild-icon__active" : undefined}
        />
      ))}
      <hr />
    </div>
  );
};
