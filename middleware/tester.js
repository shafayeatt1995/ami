// eslint-disable-next-line require-jsdoc
export default function ({redirect}) {
  if (
    !(
      window.location.hostname == 'localhost' ||
      window.location.hostname == 'macbook.local' ||
      window.location.hostname == 'sandbox.footyamigo.com'
    )
  ) {
    return redirect('/');
  }
}
