import React from "react";
import style from "../../style/Cgu.module.scss";

const Cgu = () => {
	return (
		<div className={style.cgu}>
			<h1>Conditions générales d'utilisations et de ventes</h1>
			<div className={style.maj}>
				<p>Dernière mise à jour le 4 octobre 2022</p>
			</div>
			<h2>Conditions générales d'utilisations</h2>
			<p>
				Conformément aux dispositions de la loi n° 2004-575 du 21 juin
				2004 pour la confiance en l’économie numérique, il est précisé
				aux utilisateurs et visiteurs, ci après l'"Utilisateur" du site
				bde.42mulhouse.fr, ci après le "Site", les présentes mentions
				légales stipulant notamment l’identité des différents
				intervenants dans le cadre de sa réalisation et de son suivi.
			</p>
			<p>
				La connexion et la navigation sur le Site par l'Utilisateur
				implique l'acceptation intégrale et sans réserves des présentes
				mentions légales par ce dernier.
			</p>
			<h3>Edition</h3>
			<p>
				Le Site est le site web du BDE (bureau des étudiants) de 42
				Mulhouse. Il permet l'accès aux informations le concernant, aux
				évènements organisés par ce dernier et le paiement des
				cotisations pour les étudiants connectés. Pour l'Utilisateur non
				connecté, l'accès se résume principalement à une vitrine du BDE
				et de ses évènements, ainsi qu'à la prise de contact avec ce
				dernier.
			</p>
			<ul>
				<li>
					Directeur de la publication, ci après l'"Editeur" : Allan
					Guemazi
				</li>
				<li>Adresse : 30 Rue François Spoerry, 68100 Mulhouse</li>
				<li>
					Responsabilité technique, conception et développement : ###
					### et Xxxxx XXXXXX webmaster.bde42mulhouse@gmail.com
				</li>
			</ul>
			<h3>Hébergement</h3>
			<p>
				L'hébergeur du Site est l'institut de formation 42 Mulhouse à
				l'adresse suivante : 30 Rue François Spoerry, 68100 Mulhouse,
				pouvant être contactée au 0642694269 et joint par mail via
				contact@42mulhouse.fr.
			</p>
			<h3>Accès au site</h3>
			<p>
				Le Site est accessible 7 jours sur 7 et 24 heures sur 24 en tout
				lieu, excepté en cas de force majeure, de maintenance annoncée
				ou non ou d'interruption annoncée, temporaire ou définitive, des
				services. Dans ces cas, l'Editeur ne saurait être tenu
				responsable de modifications, alterations, interruptions ou
				suspensions du Site. <br />
				L'Utilisateur est intégralement responsable de l’utilisation et
				de la conservation de ses Identifiants de Connexion. Il devra
				aussi informer sans délai le BDE 42 Mulhouse s’il constate une
				faille de sécurité liée au détournement de ceux-ci ou des
				services du Site.
			</p>
			<h3>Propriété intelectuelle</h3>
			<p>
				La présentation et le contenu du Site constituent, ensemble, une
				œuvre protégée par les lois en vigueur sur la propriété
				intellectuelle. Aucune exploitation commerciale, reproduction,
				représentation, utilisation, adaptation, modification,
				incorporation, traduction, partielle ou intégrale des éléments
				de ce site ne pourra en être faite sans l'accord préalable et
				écrit du BDE 42 Mulhouse, à l'exception de l'utilisation pour un
				usage privé sous réserve des dispositions différentes voire plus
				restrictives du Code de la propriété intellectuelle. Tout le
				contenu du Site, incluant, de façon non limitative, les
				graphismes, images, textes, vidéos, animations, sons, logos,
				gifs et icônes ainsi que leur mise en forme sont la propriété
				exclusive du BDE 42 Mulhouse à l'exception des marques, logos ou
				contenus appartenant à d'autres sociétés partenaires ou auteurs.
				BDE 42 Mulhouse est identiquement propriétaire des "droits des
				producteurs de bases de données" visés au Livre III, Titre IV,
				du Code de la Propriété Intellectuelle (loi n° 98-536 du 1er
				juillet 1998) relative aux droits d'auteur et aux bases de
				données.
			</p>
			<h3>Cookies</h3>
			<p>
				Le Site utilise un cookie de session pour assurer son bon
				fonctionnement. Aucune information concernant l'Utilisateur du
				Site n'est récupérée. (Un cookie est un petit fichier texte
				enregistré, lu par le navigateur de l'Utilisateur et déposé par
				les sites internet qu'il visite. Quasiment tous les sites
				utilisent des cookies pour bien fonctionner et optimiser leur
				ergonomie et leurs fonctionnalités.)
			</p>
			Il n’y a aucune exploitation commerciale, même partielle, des
			données présentes sur le Site et elles ne pourront l’être sans
			l’accord préalable et écrit de l’Association 42Mulhouse.
			<h3>Nous contacter</h3>
			<p>
				Par email via le{" "}
				<a href="${process.env.REACT_APP_API_URL}/contact">
					formulaire de contact
				</a>
			</p>
			<h2>Conditions générales de ventes</h2>
			<h3>Clause n° 1 : Objet et champ d'application</h3>
			<p>
				Les présentes conditions générales de vente (CGV) constituent le
				socle de la négociation commerciale et sont systématiquement
				adressées ou remises à chaque acheteur pour lui permettre de
				passer commande. Les conditions générales de vente décrites
				ci-après détaillent les droits et obligations de l'association
				BDE 42 Mulhouse et de son client dans le cadre de la vente des
				marchandises suivantes, ci après "Produit" : Cotisation au BDE,
				Inscription à un événement. Toute acceptation du devis/bon de
				commande en ce compris la clause « Je reconnais avoir pris
				connaissance et j'accepte les conditions générales de vente
				ci-annexées » implique l'adhésion sans réserve de l'acheteur aux
				"Clauses" des présentes conditions générales de vente.
			</p>
			<h3>Clause n° 2 : Prix</h3>
			<p>
				Les prix des marchandises vendues sont ceux en vigueur au jour
				de la prise de commande et sont libellés en euros. Ils seront
				majorés des frais de transport applicables au jour de la
				commande. l'association BDE 42 Mulhouse s'accorde le droit de
				modifier ses tarifs à tout moment. Toutefois, elle s'engage à
				facturer les marchandises commandées aux prix indiqués lors de
				l'enregistrement de la commande.
			</p>
			<h3>Clause n° 3 : Rabais et ristournes </h3>
			<p>
				Les tarifs proposés comprennent les rabais et ristournes que
				l'association BDE 42 Mulhouse serait amenée à octroyer compte
				tenu de ses résultats ou de la prise en charge par l'acheteur de
				certaines prestations.
			</p>
			<h3>Clause n° 4 : Escompte</h3>
			<p>Aucun escompte ne sera consenti en cas de paiement anticipé.</p>
			<h3>Clause n° 5 : Modalités de paiement</h3>
			<p>
				Le règlement des commandes s'effectue : soit par carte bancaire
				sans contacts ; soit en espèce. Les règlements seront effectués
				aux conditions suivantes : Paiement comptant.
			</p>
			<h3>Clause n° 6 : Retard de paiement</h3>
			<p>
				En cas de défaut de paiement total ou partiel des marchandises
				livrées à l'échéance, l'acheteur doit verser à l'association BDE
				42 Mulhouse une pénalité de retard égale à trois fois le taux de
				l'intérêt légal. Le taux de l'intérêt légal retenu est celui en
				vigueur au jour de la livraison des marchandises. A compter du
				1er janvier 2015, le taux d'intérêt légal sera révisé tous les 6
				mois (Ordonnance n°2014-947 du 20 août 2014). Cette pénalité est
				calculée sur le montant TTC de la somme restant due, et court à
				compter de la date d'échéance du prix sans qu'aucune mise en
				demeure préalable ne soit nécessaire. En sus des indemnités de
				retard, toute somme, y compris l’acompte, non payée à sa date
				d’exigibilité produira de plein droit le paiement d’une
				indemnité forfaitaire de 40 euros due au titre des frais de
				recouvrement. Articles 441-10 et D. 441-5 du code de commerce.
			</p>
			<h3>Clause n° 7 : Clause résolutoire</h3>
			<p>
				Si dans les quinze jours qui suivent la mise en oeuvre de la
				clause "Retard de paiement", l'acheteur ne s'est pas acquitté
				des sommes restant dues, la vente sera résolue de plein droit et
				pourra ouvrir droit à l'allocation de dommages et intérêts au
				profit de l'association BDE 42 Mulhouse.
			</p>
			<h3>Clause n° 8 : Clause de réserve de propriété</h3>
			<p>
				L'association BDE 42 Mulhouse conserve la propriété des biens
				vendus jusqu'au paiement intégral du prix, en principal et en
				accessoires. À ce titre, si l'acheteur fait l'objet d'un
				redressement ou d'une liquidation judiciaire, l'association BDE
				42 Mulhouse se réserve le droit de revendiquer, dans le cadre de
				la procédure collective, les marchandises vendues et restées
				impayées.
			</p>
			<h3>Clause n° 9 : Livraison </h3>
			<p>
				La livraison est effectuée par la remise directe de la
				marchandise à l'acheteur si le Produit est physiquement
				livrable, c'est à dire qu'il s'agit d'un objet matériel. Le
				délai de livraison indiqué lors de l'enregistrement de la
				commande n'est donné qu'à titre indicatif et n'est aucunement
				garanti. Par voie de conséquence, tout retard raisonnable dans
				la livraison des produits ne pourra pas donner lieu au profit de
				l'acheteur à : l'allocation de dommages et intérêts ;
				l'annulation de la commande. Le risque du transport est supporté
				en totalité par l'acheteur. En cas de marchandises manquantes ou
				détériorées lors du transport, l'acheteur devra formuler toutes
				les réserves nécessaires sur le bon de commande à réception
				desdites marchandises. Ces réserves devront être, en outre,
				confirmées par écrit dans les cinq jours suivant la livraison,
				par courrier recommandé AR adressé à l'association.
			</p>
			<h3>Clause n° 10 : Force majeure</h3>
			<p>
				La responsabilité de l'association BDE 42 Mulhouse ne pourra pas
				être mise en oeuvre si la non-exécution ou le retard dans
				l'exécution de l'une de ses obligations décrites dans les
				présentes conditions générales de vente découle d'un cas de
				force majeure. À ce titre, la force majeure s'entend de tout
				événement extérieur, imprévisible et irrésistible au sens de
				l'article 1148 du Code civil.
			</p>
			<h3>Clause n° 11 : Principe de rétractation</h3>
			<p>
				Le cocontractant du BDE 42 Mulhouse qui garantit avoir la
				qualité de consommateur telle que définie par le droit et la
				jurisprudence française, ci après le "Client", dispose par
				principe du droit de se rétracter en renvoyant ou en restituant
				le Produit au BDE 42 Mulhouse, sans donner de motif. Pour cela,
				le Produit devra être renvoyé ou restitué au plus tard dans les
				quatorze (14) jours suivant la communication de sa décision de
				se rétracter.
			</p>
			<h4>Délai de rétractation</h4>
			<p>
				Le délai de rétractation expire quatorze (14) jours après le
				jour où le Client prend physiquement possession du bien.
			</p>
			<h4>Notification du droit de rétractation</h4>
			<p>
				Pour exercer son droit de rétractation, le Client doit notifier
				sa décision de se rétracter au moyen d’une déclaration dénuée
				d’ambiguïté (par exemple, lettre envoyée par la poste, demande
				via{" "}
				<a href="${process.env.REACT_APP_API_URL}/contact">
					formulaire de contact du Site
				</a>{" "}
				ou courriel) au : BDE 42 Mulhouse - 30 Rue François Spoerry,
				68100 Mulhouse. Pour que le délai de rétractation soit respecté,
				le Client doit transmettre sa communication relative à
				l’exercice du droit de rétractation avant l’expiration du délai
				de rétractation.
			</p>
			<h4>Effets de la rétractation</h4>
			<p>
				En cas de rétractation de la part du Client, le BDE 42 Mulhouse
				s’engage à rembourser la totalité des sommes versées, sans
				retard injustifié, et au plus tard dans les quatorze (14) jours
				à compter de la date à laquelle il est informé de la décision du
				Client de se rétracter (Article L.221-24 du Code de la
				consommation). Le BDE 42 Mulhouse peut différer le remboursement
				jusqu’à récupération du Produit. Le BDE 42 Mulhouse procédera au
				remboursement en utilisant le même moyen de paiement que celui
				que le Client aura utilisé pour la transaction initiale, sauf
				accord exprès du Client pour qu’il utilise un autre moyen de
				paiement et dans la mesure où le remboursement n’occasionnera
				pas de frais pour le Client.
			</p>
			<h4>Modalités de retour</h4>
			<p>
				Le Client devra en tout état de cause, au plus tard quatorze
				(14) jours après communication de sa décision de se rétracter au
				présent contrat, restituer le bien au BDE 42 Mulhouse - 30 Rue
				François Spoerry, 68100 Mulhouse. Ce délai est réputé respecté
				si le Client restitue le bien avant l’expiration du délai de
				quatorze (14) jours.
			</p>
			<h4>Etat du bien retourné</h4>
			<p>
				Le Produit doit être retourné suivant les consignes du BDE 42
				Mulhouse et comporter notamment tous les accessoires livrés si
				le Produit en contient. Le Produit ne doit pas être abimé. La
				responsabilité du Client n’est engagée qu’à l’égard de la
				dépréciation du bien résultant de manipulations autres que
				celles nécessaires pour établir la nature, les caractéristiques
				et le bon fonctionnement de ce Produit. En d’autres termes, le
				Client dispose de la possibilité de tester le Produit mais sa
				responsabilité pourra être engagée s’il procède à des
				manipulations autres que celles qui sont nécessaires.
			</p>
			<h3>Clause n° 12 : Tribunal compétent</h3>
			<p>
				Tout litige relatif à l'interprétation et à l'exécution des
				présentes conditions générales de vente est soumis au droit
				français. À défaut de résolution amiable, le litige sera porté
				devant le Tribunal de commerce de Mulhouse.
			</p>
		</div>
	);
};

export default Cgu;
