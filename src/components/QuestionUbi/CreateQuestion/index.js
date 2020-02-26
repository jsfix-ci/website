import React, { useState, useEffect } from 'react';
import { SectionInner } from '../../Layout/Sections';
import s from './style.module.less';
import cN from 'classnames';
import { Speechbubble } from '../Speechbubble';
import { Form, Field } from 'react-final-form';
import { CTAButton } from '../../Layout/CTAButton';
import { TextInputWrapped } from '../../Forms/TextInput';
import querystring from 'query-string';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { useUploadImage } from '../../../hooks/images';
import { useUserData } from '../../../hooks/Api/Users';
import { useSaveQuestion } from '../../../hooks/Api/Questions';
import AvatarImage from '../../AvatarImage';

export default ({ setQuestionJustSent }) => {
  const [userId, setUserId] = useState(null);
  const [uploadImageState, uploadImage] = useUploadImage();
  const [userData, requestUserData] = useUserData();
  const [questionState, uploadQuestion] = useSaveQuestion();
  const [question, saveQuestion] = useState(null);

  useEffect(() => {
    const urlParams = querystring.parse(window.location.search);
    // Will be null, if param does not exist
    setUserId(urlParams.userId);
    requestUserData(urlParams.userId);
  }, []);

  useEffect(() => {
    if (questionState === 'saved') {
      setQuestionJustSent(question);
    }
  }, [questionState]);

  if (
    questionState === 'error' ||
    uploadImageState === 'error' ||
    userId === undefined ||
    userData.state === 'error' ||
    userData.state === 'notFound'
  ) {
    return (
      <SectionInner>
        <FinallyMessage>
          {userId === undefined && <>Da ist was mit dem Link verkehrt.</>}
          {questionState === 'error' && (
            <>Das Absenden der Frage hat nicht geklappt.</>
          )}
          {uploadImageState === 'error' && (
            <>Das Hochladen des Bildes hat nicht geklappt.</>
          )}
          {userData.state === 'error' && (
            <>Benutzer Abrufen hat nicht geklappt.</>
          )}
          {userData.state === 'notFound' && (
            <>Dein Link ist nicht in Ordnung. (Benutzer nicht gefunden)</>
          )}
        </FinallyMessage>
      </SectionInner>
    );
  }

  if (questionState === 'saved') {
    return (
      <SectionInner>
        <FinallyMessage>Deine Frage ist gespeichert.</FinallyMessage>
      </SectionInner>
    );
  }

  if (questionState === 'saving' || uploadImageState == 'saving') {
    return (
      <SectionInner>
        <FinallyMessage state="progress">Speichere...</FinallyMessage>
      </SectionInner>
    );
  }

  if (userId === undefined) {
    return (
      <SectionInner>
        <FinallyMessage>
          Da ist was mit dem Link nicht richtig. (userId fehlt)
        </FinallyMessage>
      </SectionInner>
    );
  }

  return (
    <Form
      onSubmit={({ image, ...data }) => {
        saveQuestion({
          ...data,
          srcOverwrite: image && image[0],
          profilePictures: userData.user && userData.user.profilePictures,
        });
        if (image && image[0]) {
          uploadImage(userId, image[0]);
        }
        uploadQuestion(userId, data);
      }}
      validate={validate}
      initialValues={{
        username: userData.user && userData.user.username,
        question:
          userData.user &&
          userData.user.questions &&
          userData.user.questions[0] &&
          userData.user.questions[0].text,
      }}
      render={({ handleSubmit, dirtyFields }) => (
        <SectionInner>
          <form onSubmit={handleSubmit}>
            <Speechbubble>
              <Field
                name="question"
                label="Deine Frage an das Grundeinkommen"
                placeholder="Deine Frage"
                type="textarea"
                maxLength={300}
                component={TextInputWrapped}
                inputClassName={s.questionInput}
                hideLabel={true}
              />
            </Speechbubble>
            <div className={s.belowBubble}>
              {userData.user && userData.user.profilePictures ? (
                <AvatarImage
                  user={userData.user}
                  className={s.avatarImage}
                  sizes="80px"
                />
              ) : (
                <Field
                  name="image"
                  component={ImageInput}
                  user={userData.user}
                />
              )}
              {userData.user && userData.user.username ? (
                <div className={s.usernameDisplay}>
                  {userData.user.username}
                </div>
              ) : (
                <Field
                  render={TextInputWrapped}
                  name="username"
                  label="Name"
                  placeholder="Dein Name"
                  inputClassName={s.nameInput}
                />
              )}
              {userData.user && !userData.user.hasZipCode && (
                <Field
                  render={TextInputWrapped}
                  name="zipCode"
                  label="Postleitzahl"
                  placeholder="Deine Postleitzahl"
                  inputClassName={s.nameInput}
                  explanation="Wenn du deine Postleitzahl angibst, bekommst du in Zukunft passendere Infos. Die Angabe ist optional."
                />
              )}
              <div className={s.submitButtonContainer}>
                <CTAButton
                  type="submit"
                  className={cN(s.submitButton, {
                    [s.submitButtonDirty]: dirtyFields.question,
                  })}
                >
                  Abschicken
                </CTAButton>
              </div>
            </div>
          </form>
        </SectionInner>
      )}
    ></Form>
  );
};

const ImageInput = ({ input: { value, onChange, ...input }, user }) => {
  const [avatarImage, setAvatarImage] = useState(null);
  const handleChange = ({ target }) => {
    onChange(target.files);
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]);
      reader.onload = e => {
        setAvatarImage(e.target.result);
      };
    }
  };
  return (
    <label className={s.avatarImageContainer} aria-label="Lade ein Bild hoch">
      <AvatarImage
        srcOverwrite={avatarImage}
        className={s.avatarImage}
        user={user}
        sizes="80px"
      />
      <div className={s.avatarImageLabel}>Lad’ ein Bild hoch!</div>
      <input
        type="file"
        onChange={handleChange}
        className={s.avatarUploadButton}
        accept="image/png, image/jpeg"
        {...input}
      />
    </label>
  );
};

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Bitte gib einen Namen an';
  }

  return errors;
};
