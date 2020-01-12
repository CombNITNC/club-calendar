import { NextApiRequest, NextApiResponse } from 'next';
import { MeetingKind, validateKind } from '../../lib/meeting';
import fetch from 'isomorphic-unfetch';

type SlackMessage = {
  type: 'view_submission';
  view: {
    state: {
      values: [
        {
          kind: {
            type: 'static_select';
            selected_option: {
              value: MeetingKind;
            };
          };
        },
        { name: { type: 'plain_text_input'; value: string } },
        { date: { type: 'datepicker'; selected_date: string } }
      ];
    };
  };
};

const validate = (obj: any): obj is SlackMessage => {
  if (obj.type !== 'view_submission') {
    return false;
  }
  if (obj.view == null) {
    return false;
  }
  if (obj.view.state == null) {
    return false;
  }
  if (obj.view.state.values == null) {
    return false;
  }
  if ([0, 1, 2].some(key => obj.view.state.values[key] == null)) {
    return false;
  }
  if (
    ['kind', 'name', 'date'].some(
      (key, i) => obj.view.state.values[i][key] == null
    )
  ) {
    return false;
  }
  const {
    0: { kind },
    1: { name },
    2: { date },
  } = obj.view.state.values;
  if (
    !(
      kind.type === 'static_select' &&
      kind.selected_option != null &&
      validateKind(kind.selected_option.value)
    )
  ) {
    console.log(kind);
    return false;
  }
  if (!(name.type === 'plain_text_input' && name.value !== '')) {
    console.log(name);
    return false;
  }
  if (!(date.type === 'datepicker' && Date.parse(date.selected_date) != NaN)) {
    console.log(date);
    return false;
  }
  return true;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.payload == null) {
    console.log(req.body);
    res.status(400).end('Bad Request');
    return;
  }
  const mes = JSON.parse(req.body.payload);
  if (!(req.method === 'POST' && validate(mes))) {
    res.status(400).end('Bad Request');
    return;
  }

  const {
    0: {
      kind: {
        selected_option: { value: kind },
      },
    },
    1: {
      name: { value: name },
    },
    2: {
      date: { selected_date: date },
    },
  } = mes.view.state.values;

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const create_loc = `${protocol}://${req.headers.host}/api/create`;
  const create_res = await fetch(create_loc, {
    method: 'POST',
    body: JSON.stringify({ kind, name, date }),
  });
  if (!create_res.ok) {
    console.log(await create_res.text());
    res.status(500).end('Internal Server Error');
    return;
  }

  res.status(200).end('集会を作成しました');
};
